const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  importe: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  como_se_paga: {
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
  
}, {
  tableName: 'servicios',
  timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
});

module.exports = Servicio;
