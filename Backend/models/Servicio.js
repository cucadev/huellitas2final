const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema(
  {
    // NOMBRE DEL SERVICIO (ej: "Consulta clínica general")
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },

    // DESCRIPCIÓN DEL SERVICIO
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // PRECIO DEL SERVICIO
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // guarda createdAt y updatedAt
  }
);

module.exports = mongoose.model('Servicio', servicioSchema);