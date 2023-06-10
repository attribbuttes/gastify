const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Consumo extends Model {}

Consumo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    consumo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tipo_pago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monto_total: {
        type: DataTypes.FLOAT,
        allowNull: true // Puedes ajustar esto según tus requisitos
      },
      cantidad_pagos: {
        type: DataTypes.INTEGER,
        allowNull: true // Puedes ajustar esto según tus requisitos
      },
      valor_cuota: {
        type: DataTypes.FLOAT,
        allowNull: true // Puedes ajustar esto según tus requisitos
      },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    texto_libre: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING(6) // Especifica una longitud máxima de 6 caracteres para el código de color hexadecimal
    }
  },
  {
    sequelize,
    modelName: 'Consumo',
    tableName: 'gastos',
    timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
  }
);

module.exports = Consumo;
