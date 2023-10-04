var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const { Ingreso } = require('../database/models');
const { Pago } = require('../database/models');
const { Cliente } = require('../database/models');
const { Servicio } = require('../database/models');
const { Billetera } = require('../database/models'); // Importa el modelo Sequelize

const moment = require('moment');

const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('sequelize');

const totalesController = {
    index: async function (req, res, next) {
        res.send('totales')
}};
module.exports = totalesController;
