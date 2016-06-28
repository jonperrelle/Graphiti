var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('graph', {
        url: {
            type: Sequelize.TEXT
        }, 
    });



};