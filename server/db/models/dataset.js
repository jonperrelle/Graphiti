'use strict';

const Sequelize = require('sequelize');

module.exports = function (db) {

    require('./user')(db);

    const User = db.model('user');

    db.define('dataset', {
        name: {
            type: Sequelize.STRING
        },
        s3fileName: {
            type: Sequelize.TEXT
        }, 
        userUploaded: {
        	type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        socrataId: {
        	type: Sequelize.STRING,
        },
        socrataDomain: {
        	type: Sequelize.STRING,
        }

    });
};