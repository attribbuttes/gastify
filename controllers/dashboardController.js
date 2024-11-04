const { Ingreso, Consumo } = require('../database/models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const moment = require('moment');

const dashboardController = {
  dashboard: async (req, res) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Fetch all ingresos for the current month
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

      // Fetch bancarizado ingresos
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

      const bancarizadoMesCorriente = ingresosBancarizados.reduce((total, ingreso) => {
        return total + ingreso.importe;
      }, 0);

      // Fetch bancarizado consumos
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

      const sumaImportesConsumosBancarizados = consumosBancarizados.reduce((total, consumo) => {
        return total + consumo.importe;
      }, 0);

      // Fetch monthly bancarizado ingresos
      const ingresosBancarizadosMensuales = await Ingreso.findAll({
        attributes: [
          [Sequelize.fn('MONTH', Sequelize.col('fecha')), 'mes'],
          [Sequelize.fn('YEAR', Sequelize.col('fecha')), 'anio'],
          [Sequelize.fn('SUM', Sequelize.col('importe')), 'total'],
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
        order: [[Sequelize.literal('anio DESC, mes DESC')]],
      });

      res.render('dashboard', {
        ingresosBancarizados,
        consumosBancarizados,
        ingresosBancarizadosMensuales,
        sumaImportes,
        bancarizadoMesCorriente,
        sumaImportesConsumosBancarizados,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  },
};

module.exports = dashboardController;