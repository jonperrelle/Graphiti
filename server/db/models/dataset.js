var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('dataset', {
        name: {
            type: Sequelize.STRING
        },
        s3fileName: {
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