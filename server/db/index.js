'use strict';

const db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/settings')(db);
require('./models/graph')(db);
require('./models/dataset')(db);

const User = db.model('user');
const Settings = db.model('settings');
const Graph = db.model('graph');
const Dataset = db.model('dataset');

User.belongsToMany(Dataset, {through : 'user_dataset'});
Dataset.belongsToMany(User, {through : 'user_dataset'}); 
Graph.belongsTo(Dataset);
Graph.belongsTo(User);
User.hasMany(Graph);
Graph.belongsTo(Settings); 
