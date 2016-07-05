var Sequelize = require('sequelize');

module.exports = function (db) {

	require('./settings')(db);
	require('./dataset')(db);

	var Settings = db.model('settings');
	var Dataset = db.model('dataset');


    db.define('graph', {
        graphType: {
            type: Sequelize.STRING,
        },
        columns: {
            type: Sequelize.ARRAY(Sequelize.JSONB),
        },
        imageSource: {
            type: Sequelize.TEXT,
        }
    },
    {
    	defaultScope: {include: [Settings,Dataset]}
    });
};