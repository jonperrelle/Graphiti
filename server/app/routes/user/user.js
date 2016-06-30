'use strict';
const router = require('express').Router();
const fs = require('fs');
const env = require('../../../env');
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const AWS = require('aws-sdk');

AWS.config.update( {
    accessKeyId: env.amazonaws.accessKeyId,
    secretAccessKey: env.amazonaws.secretAccessKey
})
AWS.config.setPromisesDependency(require('bluebird'));
const Converter = require('csvtojson').Converter;


router.get('/:userId', function (req, res, next) {
    User.findById(req.params.userId)
    .then(function (user) {
        return user.getDatasets() 
        .then(function(datasets) {
            res.send({user, datasets});
        })
        .catch(next);
    })
    .catch(next);
});

router.post('/:userId/SocrataDataset', function(req, res, next) {

    User.findById(req.params.userId)
        .then(function(user) {
            var ds = {
                name: req.body.dataset.name,
                userUploaded: false,
                socrataId: req.body.dataset.id,
                socrataDomain: req.body.domain
            }
            return Dataset.findOrCreate({ where: ds })
                .spread(function(ds, bool) {
                    return user.addDataset(ds);
                })
                .catch(next);
        })
        .then(function() {
            res.sendStatus(201);
        })
        .catch(next);
});

router.post('/:userId/UploadedDataset', function(req, res, next) {

    let fileName = req.session.uploadedFile.originalFilename.replace(/.csv/, "");
    let s3bucket = new AWS.S3({params: {Bucket: 'graphitiDatasets'}});
    let file = fs.createReadStream(req.session.uploadedFile.path);
    let params = {Key:  req.session.uploadedFile.originalFilename, Body: file};
    s3bucket.upload(params, function(err, data) {
        if (err) {
          next(err);
        } else {
          User.findById(req.params.userId)
            .then(function(user) {
                return Dataset.create({ 
                    name: fileName,
                    s3fileName: req.session.uploadedFile.originalFilename, 
                    userUploaded: true
                })
                .then(function(ds) {
                    return user.addDataset(ds);
                })
                .catch(next);
            })
            .then(function() {
                res.sendStatus(201);
            })
            .catch(next);
        }
  });
});

router.get('/:userId/awsDataset/:datasetId',function(req,res,next){

    const s3 = new AWS.S3();
    const csvConverter = new Converter({});

    Dataset.findById(req.params.datasetId)
    .then(function (dataset) {
    	s3.getObject({Bucket: 'graphitiDatasets', Key: dataset.s3fileName},function(err, data){
    		if(err) next(err);
    		else {
                let csvString = data.Body.toString('utf8');
                csvConverter.fromString(csvString, function (err, jsonArray) {
                    if (err) next(err);
                    res.send({data: jsonArray, dataset: {resource: {name: dataset.name}}});
                });
            }
    	}); 
    })
    .catch(next);

});

module.exports = router;
