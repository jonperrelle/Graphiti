'use strict';
var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/graph')(db);

const User = db.model('user');
const Graph = db.model('graph');

Graph.belongsTo(User); //put the userId on the graph table