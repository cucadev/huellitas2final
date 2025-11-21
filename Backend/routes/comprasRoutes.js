const express = require('express');
const router = express.Router();
const compraController = require('../controllers/comprasController');

// Listado de compras
router.get('/', compraController.vistaCompras);

// Formulario nueva compra
router.get('/nuevo', compraController.formularioNuevaCompra);
router.post('/nuevo', compraController.crearCompra);

// Formulario editar compra
router.get('/editar/:id', compraController.formularioEditarCompra);
router.post('/editar/:id', compraController.editarCompra);

// Eliminar compra
router.get('/eliminar/:id', compraController.eliminarCompra);

module.exports = router;


