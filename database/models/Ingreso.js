const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ingreso = sequelize.define('Ingreso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  importe: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cliente: {
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
  tipo_pago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(6) // Especifica una longitud máxima de 6 caracteres para el código de color hexadecimal
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
