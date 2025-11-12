const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['ingreso', 'egreso'],
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Caja', movimientoSchema);