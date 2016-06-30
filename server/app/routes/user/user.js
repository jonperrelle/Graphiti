'use strict';
const router = require('express').Router();
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const AWS = require('aws-sdk');
const Graph = db.model('graph');
const Promise = require('bluebird');


router.get('/:userId', function (req, res, next) {
    User.findById(req.params.userId)
    .then(function (user) {
        return Promise.all([user.getDatasets(),user.getGraphs()]) 
        .spread(function(datasets,graphs) {
            res.send({user, datasets, graphs});
        })
        .catch(next);
    })
    .catch(next);
});


router.use('/:userId/graphs', require('../graph/graph.js'));
router.use('/:userId/datasets',require('../dataset/dataset.js'));

module.exports = router;
