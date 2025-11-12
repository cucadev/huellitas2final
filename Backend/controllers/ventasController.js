const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

exports.registrarVenta = async (req, res) => {
  try {
    const { producto, cantidad, precioUnitario, cliente } = req.body;

    const productoExistente = await Producto.findById(producto);
    if (!productoExistente) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (productoExistente.stock < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    const venta = new Venta({ producto, cantidad, precioUnitario, cliente });
    await venta.save();

    // Actualizar stock restando la cantidad vendida
    productoExistente.stock -= cantidad;
    await productoExistente.save();

    res.status(201).json({ mensaje: 'Venta registrada y stock actualizado', venta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar venta', error: error.message });
  }
};