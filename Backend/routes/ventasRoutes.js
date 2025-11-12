const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { auth } = require('../middlewares/auth');

router.post('/', auth(['admin', 'vendedor']), ventasController.registrarVenta);

module.exports = router;