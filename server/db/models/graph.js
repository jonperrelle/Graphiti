var Sequelize = require('sequelize');

module.exports = function (db) {

	require('./settings')(db);
	require('./dataset')(db);

	var Settings = db.model('settings');
	var Dataset = db.model('dataset');


    db.define('graph', {
        name: {
        	type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        columns: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },

    },
    {
    	defaultScope: {include: [Settings,Dataset]}
    });
};