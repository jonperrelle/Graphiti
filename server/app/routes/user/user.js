'use strict';
const router = require('express').Router();
const db = require('../../../db');
const User = db.model('user');
const Promise = require('bluebird');
const HttpError = require('../../../utils/HttpError');
var chalk = require('chalk');

router.param('userId', function (req, res, next, id) {

  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});

function assertIsCorrectUser (req, res, next) {
  if (+req.user.id == +req.requestedUser.id) next();
  else next(HttpError(401));
}

router.use(['/:userId/\*','/:userId'],assertIsCorrectUser);

router.get('/:userId', function (req, res, next) {
    	let user = req.requestedUser;
        Promise.all([user.getDatasets(),user.getGraphs()]) 
        .spread(function(datasets,graphs) {
            res.send({user, datasets, graphs});
        })
        .catch(next);
});

router.use('/:userId/graphs',require('../graph/graph.js'));
router.use('/:userId/datasets',require('../dataset/dataset.js'));

module.exports = router;
