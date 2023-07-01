var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const { Ingreso } = require('../database/models');
const Chart = require('chart.js');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');





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
            importe: ammount,
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
            const importe = parseFloat(consumo.importe);
      
            if (totalesPorCategoria[categoria]) {
              totalesPorCategoria[categoria] += importe;
            } else {
              totalesPorCategoria[categoria] = importe;
            }
          });
          const chartData = {
            labels: Object.keys(totalesPorCategoria),
            datasets: [{
              label: 'Totales por Categoría',
              data: Object.values(totalesPorCategoria),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          };
      
          res.render('subtotales', { consumosAgrupados, totalesPorCategoria, chartData });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos agrupados');
        }
      },
      
      //ingresos
      ingresos:  async (req, res) => {
        try {
          const ingresos = await Ingreso.findAll();
          //const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
          const currentDate  = new Date();
          const currentMonth  = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
          const currentYear = currentDate.getFullYear();
          const ingresosFiltrados = await Ingreso.findAll({
            where: {
              // Filtramos por el mes y año actual
              fecha: {
                [Op.and]: [
                  Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), currentMonth),
                  Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), currentYear)
                ]
              }
            }
          });
          
          const sumaImportes = ingresosFiltrados.reduce((total, ingreso) => {
            return total + ingreso.importe;
          }, 0);
          // Obtener el mes pasado
          const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
          
          const ingresosMesPasado = await Ingreso.findAll({
            where: {
              fecha: {
                [Op.and]: [
                  Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
                  Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
                ]
              }
            }
          });
          const sumaImportesMesPasado = ingresosMesPasado.reduce((total, ingreso) => {
            return total + ingreso.importe;
          }, 0);

          res.render('ingresos', { ingresos,sumaImportes, ingresosMesPasado:ingresosMesPasado,sumaImportesMesPasado }); // Pasar los montos a la vista
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los consumos');
        }
      },
      
      ingresosMesPasado: async (req, res) => {
        try {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();
      
          // Obtener el mes pasado
          const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      
          const ingresosFiltrados = await Ingreso.findAll({
            where: {
              fecha: {
                [Op.and]: [
                  Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
                  Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
                ]
              }
            }
          });
      
          const sumaImportes = ingresosFiltrados.reduce((total, ingreso) => {
            return total + ingreso.importe;
          }, 0);
      
          res.render('ingresos', { ingresos: ingresosFiltrados, sumaImportes });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener los ingresos del mes pasado');
        }
      },
      //ingresos
      registro:  async (req, res) => {
        try {
          const { date, name, ammount, py_mtd, horas, color, category, texto_libre } = req.body;
      
          let monto_total = 0;
          
      
          // Guardar los datos en la base de datos utilizando el modelo Consumo
          await Ingreso.create({
            fecha: date,
            cliente: name,
            importe: ammount,
            tipo_pago: py_mtd,
            horas: horas,
            categoria: category,
            color:color,
            texto: texto_libre,
            
      
          });
          
      
          const ingresos = await Ingreso.findAll();
          //const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
      
          res.render('ingresos', { title: 'Express', ingresos/* montos*/ }); // Pasar los montos a la vista
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al guardar los datos: ${error.message}');
        }
      },

      editar: async function (req, res, next) {
        try {
          const { id, fecha, consumo, importe, tipo_pago, categoria, texto_libre, color } = req.body;
    
          // Buscar el consumo por su ID
          const consumoEditado = await Consumo.findByPk(id);
    
          // Actualizar los campos del consumo
          if (consumoEditado) {
            consumoEditado.fecha = fecha;
            consumoEditado.consumo = consumo;
            consumoEditado.importe = importe;
            consumoEditado.tipo_pago = tipo_pago;
            consumoEditado.categoria = categoria;
            consumoEditado.texto_libre = texto_libre;
            consumoEditado.color = color;
    
            await consumoEditado.save(); // Guardar los cambios en la base de datos
          }
    
          // Redireccionar a la página principal
          res.redirect('/');
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al editar el consumo');
        }
      },
    
      borrar: (req, res) => {
        Consumo.destroy({
          where: {
            id: req.params.id,
          },
        })
          .then((result) => {
            res.redirect('/');
          })
          .catch((error) => {
            console.log(error);
            res.redirect('/');
          });
      },
      recurrentes: async function(req, res, next) {
        try {
            const categoria = 'servicios';
    
            const consumos = await Consumo.findAll({
                where: { categoria: categoria },
                order: ['categoria'],
            });
    
            res.render('recurrentes', { consumos });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los consumos recurrentes');
        }
    },
    
    /* (req, res) => {
        res.render('recurrentes')
      }*/
    };
    
    



module.exports=controller;
