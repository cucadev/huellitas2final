const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
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
  proveedor: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Compra', compraSchema);
