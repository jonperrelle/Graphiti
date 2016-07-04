var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('settings', {
        title: {
            type: Sequelize.STRING
        },
        width: {
            type: Sequelize.INTEGER
        },
        height: {
            type: Sequelize.INTEGER
        },
        radius: {
            type: Sequelize.INTEGER
        },
        xAxisLabel: {
        	type: Sequelize.STRING
        },
        yAxisLabel: {
        	type: Sequelize.STRING
        },
        color: {
            type: Sequelize.STRING
        },
        minX: {
            type: Sequelize.INTEGER
        },
        maxX: {
            type: Sequelize.INTEGER
        },
        minY: {
            type: Sequelize.INTEGER
        },
        maxY: {
            type: Sequelize.INTEGER
        },
        displayType: {
            type: Sequelize.ENUM('percentage', 'number')
        }
    });
};