const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ingreso = sequelize.define('Ingreso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  importe: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'ingresos',
  timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
});

module.exports = Ingreso;
