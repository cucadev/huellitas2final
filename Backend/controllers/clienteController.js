const Cliente = require('../models/Cliente');

// Mostrar listado de clientes en PUG
exports.vistaClientes = async (req, res) => {
  try {
    // Trae los clientes con sus mascotas (solo nombre, especie o los campos que tengas)
    const clientes = await Cliente.find().populate('mascotas', 'nombre especie');
    res.render('clientes/clientes', { titulo: 'Listado de Clientes', clientes });
  } catch (error) {
    res.status(500).send('Error al cargar la vista: ' + error.message);
  }
};

// Formulario para crear nuevo cliente
exports.formularioCrearCliente = (req, res) => {
  res.render('clientes/nuevo', { titulo: 'Nuevo Cliente' });
};

// Guardar nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const { dniCliente, nombre, apellido, email, telefono, direccion, observaciones } = req.body;

    const nuevoCliente = new Cliente({
      dniCliente,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      observaciones
      // No se agregan mascotas aquí, solo se visualizan
    });

    await nuevoCliente.save();
    res.redirect('/clientes');
  } catch (error) {
    res.status(400).send('Error al crear cliente: ' + error.message);
  }
};

// Formulario para editar cliente
exports.formularioEditarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate('mascotas', 'nombre especie');
    if (!cliente) return res.status(404).send('Cliente no encontrado');
    res.render('clientes/editar', { titulo: 'Editar Cliente', cliente });
  } catch (error) {
    res.status(500).send('Error al cargar cliente: ' + error.message);
  }
};

// Guardar edición de cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const { dniCliente, nombre, apellido, email, telefono, direccion, observaciones } = req.body;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      { dniCliente, nombre, apellido, email, telefono, direccion, observaciones },
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) return res.status(404).send('Cliente no encontrado');
    res.redirect('/clientes');
  } catch (error) {
    res.status(400).send('Error al actualizar cliente: ' + error.message);
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) return res.status(404).send('Cliente no encontrado');
    res.redirect('/clientes');
  } catch (error) {
    res.status(500).send('Error al eliminar cliente: ' + error.message);
  }
};

