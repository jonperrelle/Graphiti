'use strict';
const router = require('express').Router({mergeParams: true});
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const Graph = db.model('graph');
const Settings = db.model('settings');
const Promise = require('bluebird');

//Security that validates user is authenticated and has proper access control is upstream in the user router
router.delete('/:graphId', function(req, res, next) {
    Graph.findById(req.params.graphId)
    .then(function(graph) {
    	console.log(graph)
        return graph.destroy();
    })
    .then(function(gr) {
        res.sendStatus(204);
    })
    .catch(next);
});

router.post('/',function(req,res,next){

	let user = req.requestedUser;
	req.body.settings.title = req.body.settings.title || req.body.columns.map(col=> col.name).join(" .vs ");
	
	Promise.all([Dataset.findById(req.body.dataset.id),
	        Settings.create(req.body.settings)])
	.spread(function(dataset,settings){
		return Graph.create({
			graphType: req.body.type,
			columns: req.body.columns 
		})
		.then(function(graph){
			return Promise.all([
				graph.setSetting(settings),
				graph.setUser(user),
				graph.setDataset(dataset)
			]);
		})
		.catch(next);
	})
	.then(function(graph){
		console.log("HERERERE", graph)
		res.sendStatus(201);
	})
	.catch(next);
});

module.exports = router;
