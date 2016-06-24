'use strict';
const router = require('express').Router();
const soda = require('soda-js');
const env = require('../../../env');

module.exports = router;


router.put('/',function(req,res,next){
	let datasetId = req.body.dataset.resource.id;
	let domain = req.body.dataset.metadata.domain;
	let columns = req.body.arrOfColumns.join(',');

	console.log(env.socrata);

	let consumer = new soda.Consumer(domain,{'apiToken': env.socrata.apiToken});

	consumer.query().withDataset(datasetId)
		.select(columns).limit(1000)
		.getRows()
		.on('success',function(rows){
			res.send({graphData: rows, columns: columns})
		})
		.on('error',next);

});