var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const consumos = await Consumo.findAll();
    const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
    res.render('index', { title: 'Express', consumos, montos }); // Pasar los montos a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los consumos');
  }
});


router.get('/consumos', async (req, res) => {
  try {
    const consumos = await Consumo.findAll();
    const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos
    res.render('consumos', { consumos, montos }); // Pasar los montos a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los consumos');
  }
});

router.post('/guardar', async (req, res) => {
  try {
    const { date, name, ammount, py_mtd, paymentAmount, installments, installmentAmount, category, texto_libre } = req.body;

    let monto_total = 0;
    let cantidad_pagos = 0;
    let valor_cuota = 0;

    if (py_mtd === 'tarjeta') {
      monto_total = paymentAmount;
      cantidad_pagos = installments;
      valor_cuota = installmentAmount;
    }

    // Guardar los datos en la base de datos utilizando el modelo Consumo
    await Consumo.create({
      fecha: date,
      consumo: name,
      monto: ammount,
      tipo_pago: py_mtd,
      monto_total: paymentAmount,
      cantidad_pagos:installments,
      valor_cuota:installmentAmount,
      categoria: req.body.category,
      texto_libre:req.body.texto_libre,
    });

    const consumos = await Consumo.findAll();
    const montos = consumos.map(consumo => consumo.monto_total); // Obtener los montos de los consumos

    res.render('index', { title: 'Express', consumos, montos }); // Pasar los montos a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar los datos');
  }
});




module.exports = router;
