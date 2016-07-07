'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const env = require(path.join(__dirname, '../env'));
const db = new Sequelize(env.DATABASE_URI);

module.exports = db;
