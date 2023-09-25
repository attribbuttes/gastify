// Billetera.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billetera = sequelize.define('Billetera', {
  texto: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Billetera;
