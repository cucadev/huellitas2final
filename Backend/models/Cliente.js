const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  dniCliente: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  mascotas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mascota'  // Relación con el modelo de Mascota
  }],
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Cliente', clienteSchema);
