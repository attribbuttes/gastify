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

const controllerBancarizado = {
  // controlador del home

bancarizadoData: async (req, res) => {
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
     
      const ingresosBancarizadosMensuales = await Ingreso.findAll({
        where: {
          tipo_pago: {
            [Op.in]: ['debito', 'transfer', 'mercado'],
          },
          fecha: {
            [Op.lt]: moment(), // Filtra los ingresos anteriores a la fecha actual
          },
        },
        order: [['fecha', 'DESC']], // Ordena por fecha descendente
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


      res.render('bancarizado', { ingresosBancarizados, consumosBancarizados,
        ingresosBancarizadosMensuales,
        // Otras variables que desees pasar a la vista...
        bancarizadoMesCorriente: sumaImportesBancarizados,
        sumaImportesConsumosBancarizados: sumaImportesConsumosBancarizados,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  },
};





module.exports = controllerBancarizado;