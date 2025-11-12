const mongoose = require('mongoose');

// Función para generar ID incremental
const getNextId = async function () {
  const lastPet = await mongoose.model('Mascota').findOne().sort({ mascotaId: -1 });
  if (!lastPet) return "0001";

  const lastId = parseInt(lastPet.mascotaId);
  const newId = (lastId + 1).toString().padStart(4, '0');
  return newId;
};

const MascotaSchema = new mongoose.Schema({
  mascotaId: { type: String, unique: true }, // ID autogenerado

  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  raza: { type: String },
  sexo: { type: String, enum: ["Macho", "Hembra"], required: true },
  edad: { type: Number },
  peso: { type: Number },

  fechaPrimeraConsulta: { type: Date, required: true },

  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },

  numeroChip: { type: String, default: "" },
  observaciones: { type: String, default: "" }
});

// Middleware para generar ID antes de guardar
MascotaSchema.pre('save', async function (next) {
  if (!this.mascotaId) {
    this.mascotaId = await getNextId();
  }
  next();
});

module.exports = mongoose.model('Mascota', MascotaSchema);

