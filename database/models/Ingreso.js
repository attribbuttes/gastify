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
    allowNull: true
  },
  fuente: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  texto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  horas:    {
  type: DataTypes.INTEGER,
  allowNull: true // o false según tus requisitos
},
}, {
  tableName: 'ingresos',
  timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
});

module.exports = Ingreso;
