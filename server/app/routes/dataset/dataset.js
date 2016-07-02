'use strict';
const router = require('express').Router({ mergeParams: true });
const fs = require('fs');
const env = require('../../../env');
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const AWS = require('aws-sdk');
const Converter = require('csvtojson').Converter;

AWS.config.update({
    accessKeyId: env.amazonaws.accessKeyId,
    secretAccessKey: env.amazonaws.secretAccessKey
})

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

    let ds = {
        name: req.body.dataset.name,
        userUploaded: false,
        socrataId: req.body.dataset.id,
        socrataDomain: req.body.domain
    }

    Dataset.findOrCreate({ where: ds })
        .then(function(dataset) {
            return user.addDataset(dataset);
        })
        .then(function(ds) {
            if (ds.length) res.sendStatus(201);
            else res.sendStatus(204);
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
                .then(function(ds, bool) {
                    return user.addDataset(ds);
                })
                .then(function() {
                    res.sendStatus(201);
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
                        res.send({ data: jsonArray, dataset: { resource: { name: dataset.name } } });
                    });
                }
            });
        })
        .catch(next);
});

module.exports = router;
