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



router.post('/guardar', controller.guardar);




module.exports = router;
