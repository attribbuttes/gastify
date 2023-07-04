var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const controller = require('../controllers/controller');



/* GET home page. */
router.get('/', controller.index );


router.get('/consumos', controller.consumos );
router.get('/categorias', controller.categorias );
router.get('/subtotales', controller.subtotales );
router.get('/ingresos', controller.ingresos );
router.post('/ingresos', controller.registro);
router.get('/recurrentes', controller.recurrentes)
router.get('/cargarGasto', controller.cargarGasto)
router.get('/cargarIngreso', controller.cargarIngreso)
router.get('/pagos', controller.pagos)
router.get('/cargarPago', controller.cargarPago)

// Ruta para editar un consumo específico
router.post('/consumos/editar/:id', controller.editar);

// Ruta para borrar un consumo específico
router.delete('/consumos/borrar/:id', controller.borrar);


router.post('/guardar', controller.guardar);




module.exports = router;
