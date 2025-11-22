const Caja = require('../models/Caja');

// Registrar movimiento (ingreso o egreso)
exports.registrarMovimientoWeb = async (req, res) => {
  try {
    const { tipo, monto, descripcion } = req.body;

    if (!['ingreso', 'egreso'].includes(tipo)) {
      return res.status(400).send('Tipo inválido (ingreso o egreso)');
    }

    const movimiento = new Caja({ tipo, monto, descripcion });
    await movimiento.save();

    res.redirect('/caja');
  } catch (error) {
    res.status(500).send('Error al registrar movimiento: ' + error.message);
  }
};

// Obtener movimientos para vista
exports.obtenerMovimientos = async () => {
  return await Caja.find().sort({ createdAt: -1 });
};

