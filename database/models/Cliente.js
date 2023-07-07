const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  importe: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  como_paga: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_fk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'OtraTabla', // Nombre de la tabla relacionada
      key: 'id' // Nombre de la columna referenciada
    }
  },
  texto_libre: {
    type: DataTypes.STRING,
    allowNull: true
  },
    fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  cantidad_horas: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  tipo_trabajo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  

  
  
  
  
}, {
  tableName: 'clientes',
  timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
});

module.exports = Cliente;
