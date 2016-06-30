'use strict';
var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/graph')(db);
require('./models/dataset')(db);

const User = db.model('user');
const Graph = db.model('graph');
const Dataset = db.model('dataset');

User.belongsToMany(Dataset, {through : 'user_dataset'});
Dataset.belongsToMany(User, {through : 'user_dataset'}); //put the userId on the graph table

Graph.belongsTo(Dataset);
Graph.belongsTo(User); //put the userId on the graph table