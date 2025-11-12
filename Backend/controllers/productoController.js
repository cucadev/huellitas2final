const Producto = require("../models/Producto");

// Mostrar lista de productos
exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.render("productos/dashboard", { productos });
  } catch (error) {
    res.render("productos/dashboard", { productos: [] });
  }
};

// Mostrar formulario nuevo producto
exports.formNuevoProducto = (req, res) => {
  res.render("productos/nuevo");
};

// Crear nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const count = await Producto.countDocuments();
    const nuevoId = "P" + (count + 1).toString().padStart(4, "0");

    const nuevoProducto = new Producto({
      codigo: nuevoId,
      ...req.body
    });

    await nuevoProducto.save();
    res.redirect("/productos");
  } catch (error) {
    res.send("Error al agregar el producto: " + error.message);
  }
};

// Eliminar producto
exports.deleteProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    res.json({ success: false, message: "Error al eliminar el producto" });
  }
};

