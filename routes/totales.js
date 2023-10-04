var express = require('express');
var router = express.Router();
const { Consumo } = require('../database/models');
const totalesController = require('../controllers/totalesController');



/* GET home page. */
router.get('/', totalesController.index );

module.exports = router;
