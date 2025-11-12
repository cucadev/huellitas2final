const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema(
  {
    // DNI DEL EMPLEADO
    dni: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      unique: true,
      index: true
    },

    // NOMBRE DEL EMPLEADO
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // APELLIDO DEL EMPLEADO
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // TELÉFONO DEL EMPLEADO
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // ROL DEL EMPLEADO
    role: {
      type: String,
      required: true,
      enum: ["jefe", "atencion", "veterinario", "peluquero"],
    },

    // SERVICIOS QUE BRINDA (RELACIÓN CON COLECCIÓN "Servicio")
    servicios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
      }
    ],
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
  }
);

module.exports = mongoose.model('Empleado', empleadoSchema);