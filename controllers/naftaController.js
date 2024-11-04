var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const moment = require('moment');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('sequelize'); // Asegúrate de que la ruta es correcta

const controller = {
  // Controlador para obtener todas las entradas de transporte
  index: async (req, res) => {
    try {
      // Consulta para obtener todas las entradas de la categoría 'transporte'
      const gastosTransporte = await Consumo.findAll({
        where: {
          categoria: 'transporte'
        },
        order: [['fecha', 'DESC']] // Ordena por fecha descendente si lo deseas
      });

      // Enviar los datos a la vista
      res.render('gastosTransporte', {
        title: 'Gastos de Transporte',
        gastos: gastosTransporte
      });
    } catch (error) {
      console.error('Error al obtener los gastos de transporte:', error);
      res.status(500).send('Error al obtener los gastos de transporte');
    }
  }
};

module.exports = controller;
