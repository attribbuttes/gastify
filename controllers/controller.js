var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const { Ingreso } = require('../database/models');
const { Pago } = require('../database/models');
const { Cliente } = require('../database/models');
const { Servicio } = require('../database/models');



const Chart = require('chart.js');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const controller = {
  // controlador del home
  index: async function (req, res, next) {
    try {
      const consumos = await Consumo.findAll();
      const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
      res.render('index', { title: 'Express', consumos, montos }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },
  //todos los gastos 
  consumos: async (req, res) => {
    try {
      const consumos = await Consumo.findAll();
      /*const montos = consumos.map(consumo => consumo.monto_total);*/// Obtener los montos de los consumos
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
      const currentYear = currentDate.getFullYear();
      const gastosFiltrados = await Consumo.findAll({
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

      const sumaConsumos = gastosFiltrados.reduce((total, consumo) => {
        return total + consumo.importe;
      }, 0);
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      /*----*/
      const consumosMesPasado = await Consumo.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });
      const sumaConsumosMesPasado = consumosMesPasado.reduce((total, consumo) => {
        return total + consumo.importe;
      }, 0);

      res.render('consumos', { consumos, sumaConsumos, consumosMesPasado: consumosMesPasado, sumaConsumosMesPasado /*montos */ }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },
  cargarGasto: (req, res) => {
    res.render('addConsumo')
  },
  //post de guardar gasto redirije a index
  guardar: async (req, res) => {
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
        color: color,
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
  // hasta aca la home

  //get, post y formulario de ingresos

  ingresos: async (req, res) => {
    try {
      const ingresos = await Ingreso.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
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

      res.render('ingresos', { ingresos, sumaImportes, ingresosMesPasado: ingresosMesPasado, sumaImportesMesPasado }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },

  cargarIngreso: (req, res) => {
    res.render('addIngreso')
  },

  //POST ingresos
  registro: async (req, res) => {
    try {
      const { date, name, ammount, py_mtd, horas, color, category, texto_libre } = req.body;

      await Ingreso.create({
        fecha: date,
        cliente: name,
        importe: ammount,
        tipo_pago: py_mtd,
        horas: horas,
        categoria: category,
        color: color,
        texto: texto_libre,
      });

      const ingresos = await Ingreso.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const ingresosFiltrados = await Ingreso.findAll({
        where: {
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

      res.render('ingresos', {
        title: 'Express',
        ingresos,
        sumaImportes,
        ingresosMesPasado,
        sumaImportesMesPasado
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error al guardar los datos: ${error.message}`);
    }
  },
  //hasta aca ingresos

  //pagos, get, post y formulario
  //GET PAGOS
  pagos: async (req, res) => {
    try {
      const pagos = await Pago.findAll();


      res.render('pagos', { pagos }/*{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }*/); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },

  //POST de pagos
  nuevoPago: async (req, res) => {
    try {
      const { date, name, ammount, text, id_fk } = req.body;



      // Guardar los datos en la base de datos utilizando el modelo Consumo
      await Pago.create({
        Fecha: date,
        Empresa: name,
        Importe: ammount,
        texto: text,
        id_fk: id_fk,

      });


      const pagos = await Pago.findAll();

      res.render('pagos', { title: 'Express', pagos }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al guardar los datos: ${error.message}');
    }
  },
  cargarPago: (req, res) => {
    res.render('addPago')
  },
  //hasta aca pagos

  //cargar servicios
  servicios: async (req, res) => {
    try {
      const servicios = await Servicio.findAll();


      res.render('servicios', { servicios }/*{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }*/); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },
  cargarServicio: (req, res) => {
    res.render('addServicio')
  },
  nuevoServicio: async (req, res) => {
    try {
      const { date, name, ammount, text, py_mtd, id_fk, } = req.body;

      
      // Guardar los datos en la base de datos utilizando el modelo Consumo
      await Servicio.create({
        fecha: date,
        empresa: name,
        importe: ammount,
        como_se_paga: py_mtd,
        id_fk: id_fk,
        texto_libre:text,


      });


      const servicios = await Servicio.findAll();

      res.render('servicios', { servicios }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al guardar los datos');
    }
  },

  //fin de servicios


  //get, post y formulario de clientes


  cargarCliente: async (req, res) => {
    try {
      res.render('addCliente')
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },
  nuevoCliente: async (req, res) => {
    try {
      const { date, name, ammount, id_fk, py_mtd, horas, color, category, texto_libre } = req.body;

      await Cliente.create({
        fecha: date,
        nombre: name,
        importe: ammount,
        como_paga: py_mtd,
        horas: horas,
        id_fk: id_fk,
        categoria: category,
        color: color,
        texto: texto_libre,
      });

      const clientes = await Cliente.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const ingresosFiltrados = await Cliente.findAll({
        where: {
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

      res.render('clientes', {
        title: 'Express',
        clientes,
        sumaImportes,
        ingresosMesPasado,
        sumaImportesMesPasado
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error al guardar los datos: ${error.message}`);
    }
  },

  //hasta aca los clientes

  //recursos

  categorias: async function (req, res, next) {
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


  subtotales: async function (req, res, next) {
    try {
      const consumos = await Consumo.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
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
  
      const subtotalesFiltrados = await Consumo.findAll({
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
  
      const sumaSubtotales = subtotalesFiltrados.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);
  
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const subtotalesMesPasado = await Consumo.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });
  
      const sumaSubtotalesMesPasado = subtotalesMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);
  
      const chartDataMesActual = {
        labels: Object.keys(totalesPorCategoria),
        datasets: [{
          label: 'Totales por Categoría (Mes Actual)',
          data: Object.values(totalesPorCategoria),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
  
      const chartDataMesPasado = {
        labels: Object.keys(totalesPorCategoria),
        datasets: [{
          label: 'Totales por Categoría (Mes Pasado)',
          data: Object.values(totalesPorCategoria),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      };
  
      res.render('subtotales', { totalesPorCategoria, sumaSubtotales, sumaSubtotalesMesPasado, chartDataMesActual, chartDataMesPasado });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos agrupados');
    }
  },
  



  /*
  subtotales: async function (req, res, next) {
    try {
      const consumos = await Consumo.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
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

      const subtotalesFiltrados = await Consumo.findAll({
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

      const sumaSubtotales = subtotalesFiltrados.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const subtotalesMesPasado = await Consumo.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });
      const sumaSubtotalesMesPasado = subtotalesMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

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






      res.render('subtotales', { sumaSubtotales, subtotalesMesPasado, sumaSubtotalesMesPasado, consumosAgrupados, totalesPorCategoria, chartData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos agrupados');
    }
  },*/





  recurrentes: async function (req, res, next) {
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


  ayuda: (req, res) => {
    res.render('registroDeServicios')
  },
  clientes: async (req, res) => {
    try {
      const clientes = await Cliente.findAll();
      res.render('clientes', { clientes }/*{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }*/); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },

  heladera: (req, res) => {
    res.render('heladera')
  },
  pronosticos: (req, res) => {
    res.render('pronosticos')
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
  /* (req, res) => {
      res.render('recurrentes')
    }*/
};





module.exports = controller;
