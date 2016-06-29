var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('dataset', {
        s3url: {
            type: Sequelize.TEXT
        }, 
        userUploaded: {
        	type: Sequelize.BOOLEAN,
        	allowNull: false
        },
        socrataId: {
        	type: Sequelize.STRING,
        },
        socrataDomain: {
        	type: Sequelize.STRING,
        }

    });
};