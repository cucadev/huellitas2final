const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const Cliente = require('../models/Cliente');

// VISTA PRINCIPAL (RENDERIZA PUG CON CALENDARIO)
router.get('/', agendaController.vistaAgenda);

// RUTAS API PARA FULLCALENDAR (DEVUELVEN JSON)
router.get('/api', agendaController.getAgendasByDate);    // OBTENER CITAS POR FECHA
router.post('/api', agendaController.createAgenda);       // CREAR UNA NUEVA CITA
router.put('/api/:id', agendaController.updateAgenda);    // ACTUALIZAR UNA CITA POR ID
router.delete('/api/:id', agendaController.deleteAgenda); // ELIMINAR UNA CITA POR ID

// ========================================
// BUSCAR CLIENTE POR DNI (PARA AGENDA)
// ========================================
router.get('/api/clientes/busqueda/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    
    //console.log('BÚSQUEDA DESDE AGENDA - DNI:', dni);

    // BUSCAR EN AMBOS CAMPOS
    const cliente = await Cliente.findOne({ dniCliente: dni }) || 
                   await Cliente.findOne({ dni: dni });

    if (!cliente) {
      return res.status(404).json({ 
        message: "Cliente no encontrado con ese DNI",
        dniBuscado: dni
      });
    }

    res.json(cliente);
  } catch (error) {
    console.error('❌ ERROR en ruta agenda:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
