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

router.post('/:userId/addSocrataDataset', function(req, res, next) {

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

router.post('/:userId/addUploadedDataset', function(req, res, next) {

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

router.get('/:userId/allDatasets', function(req, res, next) {
    User.findById(req.params.userId)
    .then(function (user) {
        return user.getDatasets() 
    })
    .then(function(datasets) {
        res.send(datasets);
    })
    .catch(next);



})

router.get('/:userId/awsDataset/',function(req,res,next){

    const s3 = new AWS.S3();

    User.findOne({
        include: [Dataset],
        where: {
            id: req.params.userId
        }
    })
    .then(function (user) {
        console.log(user.datasets);
    	s3.getObject({Bucket: 'graphitiDatasets', Key: user.datasets[0].s3fileName},function(err, data){
    		if(err) next(err);
    		else console.log("Here", data);
    		res.sendStatus(201);
    	}); 
    })
    .catch(next);

});

module.exports = router;
