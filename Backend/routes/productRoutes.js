const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Listado principal
router.get('/', productoController.getProductos);

// Nuevo producto
router.get('/nuevo', productoController.formNuevoProducto);
router.post('/nuevo', productoController.createProducto);

// Editar producto
router.get('/editar/:id', productoController.formNuevoProducto);

// Eliminar producto 
router.delete('/eliminar/:id', productoController.deleteProducto);

module.exports = router;








