'use strict';
const router = require('express').Router();
const db = require('../../../db');
const User = db.model('user');
const Promise = require('bluebird');
const HttpError = require('../../../utils/HttpError');

router.param('userId', function (req, res, next, id) {
  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});

function assertIsLoggedIn (req, res, next) {
  if (req.user) next();
  else next(HttpError(401));
}

// function assertAdmin (req, res, next) {
//   if (req.user && req.user.isAdmin) next();
//   else next(HttpError(403));
// }

router.get('/:userId',assertIsLoggedIn, function (req, res, next) {
    
    	let user =  req.requestedUser;

        Promise.all([user.getDatasets(),user.getGraphs()]) 
        .spread(function(datasets,graphs) {
            res.send({user, datasets, graphs});
        })
        .catch(next);
});


router.use('/:userId/graphs', require('../graph/graph.js'));
router.use('/:userId/datasets',require('../dataset/dataset.js'));

module.exports = router;
