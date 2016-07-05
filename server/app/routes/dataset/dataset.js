'use strict';
const router = require('express').Router({ mergeParams: true });
const fs = require('fs');
const env = require('../../../env');
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const AWS = require('aws-sdk');
const Converter = require('csvtojson').Converter;
const chalk = require('chalk')

AWS.config.update({
    accessKeyId: env.amazonaws.accessKeyId,
    secretAccessKey: env.amazonaws.secretAccessKey
})

router.get('/:datasetId', function(req, res, next) {

    Dataset.findById(req.params.datasetId)
        .then(function(dataset) {
            res.send(dataset);
        })
        .catch(next);
});

//Security that validates user is authenticated and has proper access control is upstream in the user router
router.delete('/:datasetId', function(req, res, next) {
    Dataset.findById(req.params.datasetId)
        .then(function(dataset) {
            return dataset.destroy();
        })
        .then(function() {
            res.sendStatus(204)
        })
        .catch(next);
});

router.post('/SocrataDataset', function(req, res, next) {
    
    let user = req.requestedUser;
    let dataset = {
        socrataId: req.body.dataset.socrataId,
        socrataDomain: req.body.dataset.socrataDomain,
        name: req.body.dataset.name
    };

    Dataset.findOrCreate({ where: dataset })
        .then(function(ds) {
            user.addDataset(ds[0])
                .then(function() {
                    res.send(ds);  
                });
        })
        .catch(next);
});

router.post('/UploadedDataset', function(req, res, next) {

    let fileName = req.session.uploadedFile.originalFilename.replace(/.csv/, "");
    let s3bucket = new AWS.S3({ params: { Bucket: 'graphitiDatasets' } });
    let file = fs.createReadStream(req.session.uploadedFile.path);
    let params = { Key: req.session.uploadedFile.originalFilename, Body: file };


    s3bucket.upload(params, function(err, data) {
        if (err) {
            next(err);
        } else {

            let user = req.requestedUser;

            Dataset.findOrCreate({
                    where: {
                        name: fileName,
                        s3fileName: req.session.uploadedFile.originalFilename,
                        userUploaded: true
                    }
                })
                .then(function(ds) {
                    user.addDataset(ds[0])
                        .then(function() {
                            return res.send(ds);
                    });
                })
                .catch(next);
        }
    });
});

router.get('/awsDataset/:datasetId', function(req, res, next) {

    const s3 = new AWS.S3();
    const csvConverter = new Converter({});

    Dataset.findById(req.params.datasetId)
        .then(function(dataset) {
            s3.getObject({ Bucket: 'graphitiDatasets', Key: dataset.s3fileName }, function(err, data) {
                if (err) next(err);
                else {
                    let csvString = data.Body.toString('utf8');
                    csvConverter.fromString(csvString, function(err, jsonArray) {
                        if (err) next(err);
                        res.send(jsonArray);
                    });
                }
            });
        })
        .catch(next);
});

module.exports = router;
