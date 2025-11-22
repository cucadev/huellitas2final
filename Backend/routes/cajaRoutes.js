const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/cajaController');

// Dashboard de caja
router.get('/', async (req, res) => {
  try {
    const movimientos = await cajaController.obtenerMovimientos();
    let saldo = 0;

    movimientos.forEach(m => {
      saldo += m.tipo === 'ingreso' ? m.monto : -m.monto;
    });

    res.render('caja/dashboard', { 
      titulo: 'Caja', 
      movimientos, 
      saldo 
    });
  } catch (error) {
    res.status(500).send('Error al cargar la caja: ' + error.message);
  }
});

// Registrar movimiento desde formulario web
router.post('/', cajaController.registrarMovimientoWeb);

module.exports = router;

