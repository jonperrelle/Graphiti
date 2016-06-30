'use strict';
const router = require('express').Router({mergeParams: true});
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const Graph = db.model('graph');
const Settings = db.model('settings');
const Promise = require('bluebird');


// router.get('/:graphId',function(req,res,next){
	
// 	Graph.findById(req.params.graphId)
// 	.then(graph => res.send(graph))
// 	.catch(next)
// })
router.delete('/:graphId', function(req, res, next) {
    Graph.findById(req.params.graphId)
    .then(function(graph) {
        return graph.destroy();
    })
    .then(function(gr) {
        console.log(gr);
        res.sendStatus(204);
    })
    .catch(next);
})


router.post('/',function(req,res,next){

	Promise.all([Dataset.findById(req.body.dataset.id),
	        User.findById(req.params.userId),
	        Settings.create(req.body.settings)])
	.spread(function(dataset,user,settings){

		return Graph.create(req.body.graph)
		.then(function(graph){
			return Promise.all([graph.setSetting(settings),
						graph.setUser(user),
						graph.setDataset(dataset)])
		})
		.catch(next);


	})
	.then(function(graph){
		res.sendStatus(201);
	})

})

module.exports = router;
