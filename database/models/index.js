const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: null,
  database: 'gastos'
});

const models = {};

// Carga todos los modelos del directorio "models"
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    models[model.name] = model;
  });

// Asocia los modelos si existen relaciones entre ellos
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Exporta el objeto sequelize y los modelos cargados
module.exports = {
  sequelize,
  ...models
};
