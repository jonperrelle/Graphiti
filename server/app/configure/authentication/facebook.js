'use strict';
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app, db) {

    const User = db.model('user');

    let facebookConfig = app.getValue('env').FACEBOOK;

    let facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    };

    let verifyCallback = function (accessToken, refreshToken, profile, done) {

        
        User.findOne({
                where: {
                    facebook_id: profile.id
                }
            })
            .then(function (user) {

                if (user) {
                    return user;
                } else {

                    let lastName = profile.name.familyName,
                        firstName = profile.name.givenName,
                        email = profile._json.email,
                        facebook_id = profile.id;

                    return User.create({
                        facebook_id, lastName, firstName, email
                    });
                }
            })
            .then(function (userToLogin) {
                done(null, userToLogin);
            })
            .catch(function (err) {
                console.error('Error creating user from Facebook authentication', err);
                done(err);
            });

    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });

};
