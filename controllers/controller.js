var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');

const controller = {
   index: async function(req, res, next) {
        try {
          const consumos = await Consumo.findAll();
          const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
          res.render('index', { title: 'Express', consumos, montos }); // Pasar los montos a la vista
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos');
        }
      },
      /*consumos: async (req, res) => {
        try {
          const consumosAgrupados = await Consumo.findAll({
            attributes: ['categoria', [Sequelize.fn('SUM', Sequelize.col('monto_total')), 'total']],
            group: ['categoria'],
          });
          
          const consumos = await Consumo.findAll();
          const consumosDetallados = await Consumo.findAll(); // Obtener todos los consumos sin agrupar
    
          res.render('consumos', { consumos, consumosAgrupados, consumosDetallados });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos');
        }
      },*/
      consumos:  async (req, res) => {
        try {
          const consumos = await Consumo.findAll();
          const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
          res.render('consumos', { consumos, montos }); // Pasar los montos a la vista
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos');
        }
      },
    guardar:  async (req, res) => {
        try {
          const { date, name, ammount, py_mtd, paymentAmount, installments, installmentAmount, color, category, texto_libre } = req.body;
      
          let monto_total = 0;
          let cantidad_pagos = 0;
          let valor_cuota = 0;
      
          if (py_mtd === 'tarjeta') {
            monto_total = paymentAmount;
            cantidad_pagos = installments;
            valor_cuota = installmentAmount;
          } else {
            monto_total = ammount;
            cantidad_pagos = 1;
            valor_cuota = ammount;
          }
          
      
          // Guardar los datos en la base de datos utilizando el modelo Consumo
          await Consumo.create({
            fecha: date,
            consumo: name,
            monto: ammount,
            tipo_pago: py_mtd,
            monto_total: monto_total,
            cantidad_pagos: cantidad_pagos,
            valor_cuota: valor_cuota,
            categoria: category,
            color:color,
            texto_libre: texto_libre,
            
      
          });
          
      
          const consumos = await Consumo.findAll();
          const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
      
          res.render('index', { title: 'Express', consumos, montos }); // Pasar los montos a la vista
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al guardar los datos');
        }
      },

      categorias: async function(req, res, next) {
        try {
          const consumosAgrupados = await Consumo.findAll({
            order: ['categoria'],
          });
          
    
          res.render('categorias', { consumosAgrupados });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos agrupados');
        }
      },
      
      subtotales: async function(req, res, next) {
        try {
          const consumosAgrupados = await Consumo.findAll({
            order: ['categoria'],
          });
      
          const totalesPorCategoria = {};
          consumosAgrupados.forEach(consumo => {
            const categoria = consumo.categoria;
            const monto = parseFloat(consumo.monto);
      
            if (totalesPorCategoria[categoria]) {
              totalesPorCategoria[categoria] += monto;
            } else {
              totalesPorCategoria[categoria] = monto;
            }
          });
      
          res.render('subtotales', { consumosAgrupados, totalesPorCategoria });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos agrupados');
        }
      },
    };
      



module.exports=controller;
