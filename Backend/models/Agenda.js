const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema(
  {
    // TITULO DE LA CITA (REQUERIDO POR FULLCALENDAR)
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // FECHA DE LA CITA (SOLO DÍA)
    date: {
      type: Date,
      required: true,
    },

    // HORA DE LA CITA
    time: {
      type: String,
      required: true,
      trim: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // FORMATO HH:MM (24 horas)
    },

    // REFERENCIA AL CLIENTE (RELACIÓN CON EL MODELO CLIENTE)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },

    // DNI DEL CLIENTE (CAMPO PRINCIPAL PARA AUTOCOMPLETAR)
    dni_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // NOMBRE DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    name_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // APELLIDO DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    lastname_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // EMAIL DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    email_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      lowercase: true,
    },

    // TELÉFONO DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    phone_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // DIRECCIÓN DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    address_client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // CIUDAD DEL CLIENTE (SE AUTOCOMPLETA DESDE CLIENTES)
    // city_client: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   maxlength: 80,
    // },

    // NOMBRE DE LA MASCOTA
    pet_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // TIPO DE MASCOTA (PERRO O GATO)
    pet_type: {
      type: String,
      required: true,
      enum: ['Perro', 'Gato'],
      trim: true,
    },

    // PROFESIONAL QUE ATIENDE (VETERINARIO)
    professional: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // MOTIVO/OBSERVACIONES DE LA CONSULTA
    observations: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // ESTADO DE LA CITA
    status: {
      type: String,
      enum: ['Programada', 'Confirmada', 'En proceso', 'Completada', 'Cancelada'],
      default: 'Programada',
    },

    // COLOR PARA FULLCALENDAR (OPCIONAL)
    backgroundColor: {
      type: String,
      default: '#3498db',
    },

    // COLOR DEL BORDE PARA FULLCALENDAR (OPCIONAL)
    borderColor: {
      type: String,
      default: '#2980b9',
    },
  },
  {
    // ACTIVA 'createdAt' Y 'updatedAt' AUTOMATICOS
    timestamps: true,
  }
);

module.exports = mongoose.model('Agenda', agendaSchema);