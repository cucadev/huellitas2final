const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  productoId: { type: String, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  proveedor: { type: String },
  costo_unitario: { type: Number, default: 0 },
  unidad_venta: { type: String },
  categoria: { type: String },
  precio_venta: { type: Number, default: 0 },
  stock_actual: { type: Number, default: 0 },
  stock_minimo: { type: Number, default: 0 }
}, { timestamps: true });

// Generar ID automático
productoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastProduct = await mongoose.model("Producto").findOne().sort({ createdAt: -1 });
    let nextNumber = 1;

    if (lastProduct && lastProduct.productoId) {
      const num = parseInt(lastProduct.productoId.replace("P", ""), 10);
      if (!isNaN(num)) nextNumber = num + 1;
    }

    this.productoId = `P${String(nextNumber).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.models.Producto || mongoose.model("Producto", productoSchema);




