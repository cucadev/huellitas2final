const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// VISTA PRINCIPAL
router.get('/', empleadoController.vistaEmpleados);

// RUTAS PARA FORMULARIOS (REDIRIGEN)
router.post('/', empleadoController.crearEmpleado);
router.post('/editar/:id', empleadoController.actualizarEmpleado);
router.post('/eliminar/:id', empleadoController.eliminarEmpleado);

// ========================================
// RUTAS API PARA FRONTEND (AGENDA)
// ========================================

// OBTENER TODOS LOS EMPLEADOS (JSON)
router.get('/api/empleados', empleadoController.getEmpleados);

// OBTENER EMPLEADO POR ID (JSON)
router.get('/api/empleados/:id', empleadoController.getEmpleadoById);

// OBTENER SOLO VETERINARIOS (PARA AGENDA)
router.get('/api/empleados/rol/veterinario', empleadoController.getVeterinarios);

// OBTENER SOLO PELUQUEROS (PARA AGENDA)
router.get('/api/empleados/rol/peluquero', empleadoController.getPeluqueros);

module.exports = router;