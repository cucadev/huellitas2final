const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// VISTA PRINCIPAL
router.get('/', servicioController.vistaServicios);

// RUTAS PARA FORMULARIOS (REDIRIGEN)
router.post('/', servicioController.crearServicio);
router.post('/editar/:id', servicioController.actualizarServicio);
router.post('/eliminar/:id', servicioController.eliminarServicio);

module.exports = router;