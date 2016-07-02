var Sequelize = require('sequelize');

module.exports = function (db) {

	require('./settings')(db);
	require('./dataset')(db);

	var Settings = db.model('settings');
	var Dataset = db.model('dataset');


    db.define('graph', {
        title: {
            type: Sequelize.STRING,
        },
        graphType: {
            type: Sequelize.STRING,
        },
        columns: {
            type: Sequelize.ARRAY(Sequelize.JSONB),
        },
    },
    {
    	defaultScope: {include: [Settings,Dataset]}
    });
};