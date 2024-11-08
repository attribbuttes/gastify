var express = require('express');
var router = express.Router();

const controller = require('../controllers/controller');
const naftaController = require('../controllers/naftaController');
const dashboardController = require('../controllers/dashboardController');



/* GET home page. */
router.get('/', controller.index );
router.get('/consumos', controller.consumos );
router.get('/cargarGasto', controller.cargarGasto)
router.post('/guardar', controller.guardar);

router.get('/ingresos', controller.ingresos );
router.get('/cargarIngreso', controller.cargarIngreso)
router.post('/ingresos', controller.registro);

router.get('/pagos', controller.pagos)
router.get('/cargarPago', controller.cargarPago)
router.post('/cargarPago', controller.nuevoPago)

router.get('/servicios', controller.servicios)
router.get('/cargarServicio', controller.cargarServicio)
router.post('/cargarServicio', controller.nuevoServicio)
router.get('/registroDeServicios', controller.ayuda)


router.get('/clientes', controller.clientes)
router.get('/cargarCliente', controller.cargarCliente)
router.post('/clientes', controller.nuevoCliente)

router.get('/categorias', controller.categorias );
router.get('/subtotales', controller.subtotales );
router.get('/recurrentes', controller.recurrentes)


router.get('/clientes', controller.clientes)
router.get('/heladera', controller.heladera)
router.get('/pronosticos', controller.pronosticos)

router.get('/tv', controller.tv)
//router.get('/tv', controller.mostrar);
//router.get('/tv', controller.agregar);

router.get('/gastos-transporte', naftaController.index);


router.get('/bancarizado', controller.bancarizado)
router.get('/dashboard', dashboardController.dashboard)





// Ruta para editar un consumo específico
router.post('/consumos/editar/:id', controller.editar);

// Ruta para borrar un consumo específico
router.delete('/consumos/borrar/:id', controller.borrar);






module.exports = router;
