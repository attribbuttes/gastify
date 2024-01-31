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

const controller = {
  // controlador del home
  index: async (req, res) => {
    try {
      const consumos = await Consumo.findAll();
      /*const montos = consumos.map(consumo => consumo.monto_total);*/// Obtener los montos de los consumos
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
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

      const filteredConsumos = consumos
      .filter(consumo => {
        const consumoDate = new Date(consumo.fecha);
        // Filtrar fechas que son iguales o anteriores a la fecha actual
        return consumoDate <= currentDate;
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      res.render('index', { consumos:filteredConsumos, sumaConsumos, consumosMesPasado: consumosMesPasado, sumaConsumosMesPasado, gastosFiltrados /*montos */ }); // Pasar los montos a la vista
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
      currentDate.setHours(0, 0, 0, 0);
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

      const filteredConsumos = consumos
      .filter(consumo => {
        const consumoDate = new Date(consumo.fecha);
        // Filtrar fechas que son iguales o anteriores a la fecha actual
        return consumoDate <= currentDate;
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      res.render('consumos', { consumos:filteredConsumos, sumaConsumos, consumosMesPasado: consumosMesPasado, sumaConsumosMesPasado, gastosFiltrados /*montos */ }); // Pasar los montos a la vista
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
        const { date, name, ammount, py_mtd, paymentAmount, installments, installmentAmount, color, category, texto_libre, firstPayment } = req.body;

        let monto_total = 0;
        let cantidad_pagos = 0;
        let valor_cuota = 0;
        let fecha_pago = new Date(date);

        if (py_mtd === 'tarjeta') {
            monto_total = paymentAmount;
            cantidad_pagos = installments;
            valor_cuota = installmentAmount;
        } else {
            monto_total = ammount;
            cantidad_pagos = 1;
            valor_cuota = ammount;
        }

        // Verificar si se debe cargar el primer pago en el mes actual o siguiente
        if (!firstPayment) {
            
        }else{
          fecha_pago.setMonth(fecha_pago.getMonth() + 1);
        }

        for (let i = 0; i < cantidad_pagos; i++) {
            // Crear un registro de consumo para cada cuota
            await Consumo.create({
                fecha: fecha_pago,
                consumo: name,
                importe: valor_cuota,
                tipo_pago: py_mtd,
                monto_total: monto_total,
                cantidad_pagos: cantidad_pagos,
                valor_cuota: valor_cuota,
                categoria: category,
                color: color,
                texto_libre: texto_libre,
            });

            // Avanzar la fecha al próximo mes para la siguiente cuota
            fecha_pago.setMonth(fecha_pago.getMonth() + 1);
        }

        const consumos = await Consumo.findAll();
        const montos = consumos.map(consumo => consumo.monto_total);

        res.render('index', { title: 'Express', consumos, montos });
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

      const sumaimportes = ingresosFiltrados.reduce((total, ingreso) => {
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
      const sumaimportesMesPasado = ingresosMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);
      const consumos = await Consumo.findAll();
      /*const montos = consumos.map(consumo => consumo.monto_total);*/// Obtener los montos de los consumos
      
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

      res.render('ingresos', { ingresos, sumaimportes, ingresosMesPasado: ingresosMesPasado, sumaimportesMesPasado, sumaConsumos}); // Pasar los montos a la vista
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

      const sumaimportes = ingresosFiltrados.reduce((total, ingreso) => {
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

      const sumaimportesMesPasado = ingresosMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      const consumos = await Consumo.findAll();
      /*const montos = consumos.map(consumo => consumo.monto_total);*/// Obtener los montos de los consumos
      
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

      res.render('ingresos', {
        title: 'Express',
        ingresos,
        sumaimportes,
        ingresosMesPasado,
        sumaimportesMesPasado, sumaConsumos
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
        fecha: date,
        empresa: name,
        importe: ammount,
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
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
      const currentYear = currentDate.getFullYear();
      const serviciosFiltrados = await Servicio.findAll({
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
      const sumaServicios = serviciosFiltrados.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const serviciosMesPasado = await Servicio.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });

      const sumaServiciosMesPasado = serviciosMesPasado.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);

      res.render('servicios', { servicios, sumaServiciosMesPasado, sumaServicios }/*{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }*/); // Pasar los montos a la vista
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

      const sumaimportes = ingresosFiltrados.reduce((total, ingreso) => {
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

      const sumaimportesMesPasado = ingresosMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      res.render('clientes', {
        title: 'Express',
        clientes,
        sumaimportes,
        ingresosMesPasado,
        sumaimportesMesPasado
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
        
  
      res.render('subtotales', { totalesPorCategoria, sumaSubtotales, sumaSubtotalesMesPasado });
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

  ayuda: async (req, res) => {
    try {
      const servicios = await Servicio.findAll();
      const consumos = await Consumo.findAll();
      const ingresos = await Ingreso.findAll();
      const pagos = await Pago.findAll();

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
      const currentYear = currentDate.getFullYear();


      const serviciosFiltrados = await Servicio.findAll({
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
      const sumaServicios = serviciosFiltrados.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);
      const consumosFiltrados = await Consumo.findAll({
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
      const sumaConsumos = consumosFiltrados.reduce((total, consumo) => {
        return total + consumo.importe;
      }, 0);

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
      const sumaIngresos = ingresosFiltrados.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      const pagosFiltrados = await Pago.findAll({
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
      const sumaPagos = pagosFiltrados.reduce((total, pago) => {
        return total + pago.importe;
      }, 0);
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const serviciosMesPasado = await Servicio.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });
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

      const pagosMesPasado = await Pago.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });


      const sumaServiciosMesPasado = serviciosMesPasado.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);

      const sumaConsumosMesPasado = consumosMesPasado.reduce((total, consumo) => {
        return total + consumo.importe;
      }, 0);

      const sumaIngresosMesPasado = ingresosMesPasado.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      const sumaPagosMesPasado = pagosMesPasado.reduce((total, pago) => {
        return total + pago.importe;
      }, 0);


      res.render('registroDeServicios', { servicios, sumaServiciosMesPasado, sumaServicios, consumos, sumaConsumos, sumaConsumosMesPasado, ingresos, sumaIngresos, sumaIngresosMesPasado, pagos, sumaPagos,sumaPagosMesPasado }/*{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }*/); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },


/*
  ayuda: async (req, res) => {
    try {
      const servicios = await Servicio.findAll();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1 para obtener el mes actual.
      const currentYear = currentDate.getFullYear();
      const serviciosFiltrados = await Servicio.findAll({
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
      const sumaServicios = serviciosFiltrados.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);
      // Obtener el mes pasado
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const serviciosMesPasado = await Servicio.findAll({
        where: {
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), lastMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), lastYear)
            ]
          }
        }
      });

      const sumaServiciosMesPasado = serviciosMesPasado.reduce((total, servicio) => {
        return total + servicio.importe;
      }, 0);

      res.render('registroDeServicios', { servicios, sumaServiciosMesPasado, sumaServicios }//{ pagos,sumaPagos, pagosMesPasado:pagosMesPasado,sumaPagosMesPasado }); // Pasar los montos a la vista
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los consumos');
    }
  },*/
    
  
  clientes: async (req, res) => {
    try {
      // Obtener la suma de los importes para cada cliente
      const clientes = await Cliente.findAll();
  
      res.render('clientes', { clientes });
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
  tv:(req, res) => {
    res.render('tv')
  },
  
  bancarizado: async (req, res) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Filtra los ingresos por tipo_pago 'debito' y 'transfer' para el mes actual
      const ingresosBancarizados = await Ingreso.findAll({
        where: {
          tipo_pago: {
            [Op.in]: ['debito', 'transfer', 'mercado'],
          },
          fecha: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), currentMonth),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), currentYear),
            ],
          },
        },
      });

      // Calcula la suma de los importes de los ingresos bancarizados
      const sumaImportesBancarizados = ingresosBancarizados.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      // Filtra los consumos por tipo_pago 'tarjeta', 'debito' o 'mercado' para el mes actual
    const consumosBancarizados = await Consumo.findAll({
      where: {
        tipo_pago: {
          [Op.in]: ['tarjeta', 'debito', 'mercado'],
        },
        fecha: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), currentMonth),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), currentYear),
          ],
        },
      },
    });

    // Calcula la suma de los importes de los consumos bancarizados
    const sumaImportesConsumosBancarizados = consumosBancarizados.reduce((total, consumo) => {
      return total + consumo.importe;
    }, 0);

    const ingresosBancarizadosMensuales = await Ingreso.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('fecha')), 'mes'],
        [sequelize.fn('YEAR', sequelize.col('fecha')), 'anio'],
        [sequelize.fn('SUM', sequelize.col('importe')), 'total'],
      ],
      where: {
        tipo_pago: {
          [Op.in]: ['debito', 'transfer', 'mercado'],
        },
        fecha: {
          [Op.lt]: moment(),
        },
      },
      group: ['mes', 'anio'],
      order: [[sequelize.literal('anio DESC, mes DESC')]],
    });

    console.log('Ingresos Bancarizados Mensuales:', ingresosBancarizadosMensuales);



      res.render('bancarizado', { ingresosBancarizados, consumosBancarizados,ingresosBancarizadosMensuales,
        // Otras variables que desees pasar a la vista...
        bancarizadoMesCorriente: sumaImportesBancarizados,
        sumaImportesConsumosBancarizados: sumaImportesConsumosBancarizados,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // BilleteraController.js


// Método para obtener todos los Billeteras
mostrar : async (req, res) => {
    try {
        const Billeteras = await Billetera.findAll();
        res.render('tv', { Billeteras });
    } catch (error) {
        console.error('Error al obtener Billeteras:', error);
        res.status(500).send('Error interno del servidor');
    }
},

// Método para agregar un nuevo Billetera
agregar: async (req, res) => {
    try {
        const nuevoBilletera = req.body.texto;
        if (nuevoBilletera) {
            await Billetera.create({ texto: nuevoBilletera });
        }
        res.redirect('/tv');
    } catch (error) {
        console.error('Error al agregar Billetera:', error);
        res.status(500).send('Error interno del servidor');
    }
},


  
  /* (req, res) => {
      res.render('recurrentes')
    }*/
};





module.exports = controller;
