const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Mascota = require('../models/Mascota');

// Listado de clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().populate('mascotas', 'nombre especie');
    res.render('clientes/clientes', { 
      titulo: 'Clientes', 
      clientes 
    });
  } catch (err) {
    res.status(500).send('Error al cargar los clientes: ' + err.message);
  }
});

// Formulario para crear nuevo cliente
router.get('/nuevo', async (req, res) => {
  const mascotas = await Mascota.find();
  res.render('clientes/nuevo', { titulo: 'Nuevo Cliente', mascotas });
});

// Crear nuevo cliente
router.post('/nuevo', async (req, res) => {
  try {
    const { dniCliente, nombre, apellido, email, telefono, direccion, observaciones, mascotas } = req.body;

    const nuevoCliente = new Cliente({
      dniCliente,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      observaciones,
      mascotas
    });

    await nuevoCliente.save();

    const clientes = await Cliente.find().populate('mascotas', 'nombre especie');
    res.render('clientes/clientes', { 
      titulo: 'Clientes',
      clientes,
      mensajeExito: 'Cliente creado correctamente'
    });
  } catch (error) {
    const mascotasDB = await Mascota.find();
    let mensajeError = 'Error al crear el cliente: ' + error.message;

    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyValue)[0];
      mensajeError = `⚠ El ${campoDuplicado} "${error.keyValue[campoDuplicado]}" ya está registrado.`;
    }

    res.render('clientes/nuevo', { 
      titulo: 'Nuevo Cliente', 
      mensajeError,
      cliente: req.body,
      mascotas: mascotasDB
    });
  }
});

// Formulario para editar cliente
router.get('/editar/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate('mascotas', 'nombre especie');
    if (!cliente) return res.status(404).send('Cliente no encontrado');
    const mascotas = await Mascota.find();
    res.render('clientes/editar', { titulo: 'Editar Cliente', cliente, mascotas });
  } catch (err) {
    res.status(500).send('Error al cargar el cliente: ' + err.message);
  }
});

// Editar cliente
router.post('/editar/:id', async (req, res) => {
  try {
    const { dniCliente, nombre, apellido, email, telefono, direccion, observaciones, mascotas } = req.body;

    await Cliente.findByIdAndUpdate(req.params.id, {
      dniCliente,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      observaciones,
      mascotas
    });

    const clientes = await Cliente.find().populate('mascotas', 'nombre especie');
    res.render('clientes/clientes', { 
      titulo: 'Clientes',
      clientes,
      mensajeExito: 'Cliente actualizado correctamente'
    });
  } catch (error) {
    let mensajeError = 'Error al actualizar el cliente: ' + error.message;
    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyValue)[0];
      mensajeError = `⚠ El ${campoDuplicado} "${error.keyValue[campoDuplicado]}" ya está registrado.`;
    }

    const cliente = await Cliente.findById(req.params.id);
    const mascotasDB = await Mascota.find();
    res.render('clientes/editar', { 
      titulo: 'Editar Cliente', 
      cliente,
      mensajeError,
      mascotas: mascotasDB
    });
  }
});

// Eliminar cliente
router.get('/eliminar/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    const clientes = await Cliente.find().populate('mascotas', 'nombre especie');
    res.render('clientes/clientes', { 
      titulo: 'Clientes',
      clientes,
      mensajeExito: 'Cliente eliminado correctamente'
    });
  } catch (err) {
    res.status(500).send('Error al eliminar cliente: ' + err.message);
  }
});

module.exports = router;



