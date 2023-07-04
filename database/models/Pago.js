const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    Fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Empresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  Importe: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  texto: {
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
  
}, {
  tableName: 'pagos',
  timestamps: false // Opcional: deshabilita la creación de las columnas "createdAt" y "updatedAt"
});

module.exports = Pago;
