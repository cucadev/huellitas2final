const Compra = require('../models/Compra');
const Producto = require('../models/Producto');

// Mostrar listado de compras
exports.vistaCompras = async (req, res) => {
  try {
    const compras = await Compra.find().populate('producto').sort({ createdAt: -1 });
    res.render('compras/compras', { titulo: 'Compras', compras });
  } catch (error) {
    res.status(500).send('Error al cargar las compras: ' + error.message);
  }
};

// Formulario nueva compra
exports.formularioNuevaCompra = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.render('compras/nuevo', { titulo: 'Nueva Compra', productos });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario: ' + error.message);
  }
};

// Crear nueva compra
exports.crearCompra = async (req, res) => {
  try {
    const { producto, cantidad, precioUnitario, proveedor } = req.body;

    const compra = new Compra({ producto, cantidad, precioUnitario, proveedor });
    await compra.save();

    // Actualizar stock del producto
    const prod = await Producto.findById(producto);
    if (prod) {
      prod.stock_actual += parseInt(cantidad);
      await prod.save();
    }

    res.redirect('/compras');
  } catch (error) {
    res.status(400).send('Error al registrar la compra: ' + error.message);
  }
};

// Formulario para editar compra
exports.formularioEditarCompra = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate('producto');
    if (!compra) return res.status(404).send('Compra no encontrada');
    const productos = await Producto.find();
    res.render('compras/editar', { titulo: 'Editar Compra', compra, productos });
  } catch (error) {
    res.status(500).send('Error al cargar la compra: ' + error.message);
  }
};

// Guardar cambios de la compra
exports.editarCompra = async (req, res) => {
  try {
    const { producto, cantidad, precioUnitario, proveedor } = req.body;
    await Compra.findByIdAndUpdate(req.params.id, { producto, cantidad, precioUnitario, proveedor });
    res.redirect('/compras');
  } catch (error) {
    res.status(400).send('Error al actualizar la compra: ' + error.message);
  }
};

// Eliminar compra
exports.eliminarCompra = async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id);
    res.redirect('/compras');
  } catch (error) {
    res.status(500).send('Error al eliminar la compra: ' + error.message);
  }
};

