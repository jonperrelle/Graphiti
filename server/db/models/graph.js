var Sequelize = require('sequelize');

module.exports = function (db) {

	require('./settings')(db);

	var Settings = db.model('settings');


    db.define('graph', {
        name: {
        	type: Sequelize.STRING,
        },
        columns: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },

    },
    {
    	defaultScope: {include: [Settings]}
    });
};