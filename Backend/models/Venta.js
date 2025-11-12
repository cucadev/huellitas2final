const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  cliente: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', ventaSchema);