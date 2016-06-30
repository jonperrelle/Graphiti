/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var Dataset = db.model('dataset');
var User = db.model('user');
var Graph = db.model('graph');
var Setting = db.model('settings');

var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });



    return Promise.all(creatingUsers);

};
var seedSet = function(){

    var set = {height: 300}
    return Setting.create(set);

}

var seedGraphs = function(){

    var graph = {name: "newGraph",columns: ['col1','col2'],userId: 1,settingId: 1,datasetId: 1}

    return Graph.create(graph);
}

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function(users){
        console.log("userrr",users[0])

        console.log(typeof users[0].addDataset)

        return Dataset.create({name: "newDS",userUploaded:true})
        .then(function(ds){

            return users[0].addDataset(ds);
        })


        // return users[0].addDataset();
    })
    .then(function(){
        return Promise.all([seedSet(),seedGraphs()]);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
