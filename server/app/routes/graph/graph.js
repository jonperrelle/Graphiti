'use strict';
const router = require('express').Router();
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const Graph = db.model('graph');
//const Settings = db.model('settings');


router.get('/:graphId',function(req,res,next){
	
	Graph.findById(req.params.graphId)
	.then(graph => res.send(graph))
	.catch(next)
})

module.exports = router;
