// database/config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gastos', 'root', null, {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
