const User = require('../models/User');
const bcrypt = require('bcrypt'); // para encriptar contraseñas
const jwt = require('jsonwebtoken'); // json web token


// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // el email ya existe?
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: passwordHash
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};


// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparar contraseñas
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirigir al dashboard
    return res.redirect('/dashboard');


  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};


// Obtener todos los usuarios
exports.obtenerUsuarios = async (_req, res) => {
  try {
    const usuarios = await User.find().select('-password'); // oculta password
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};


// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const datos = { ...req.body };

    if (datos.password) {
      const salt = await bcrypt.genSalt(10);
      datos.password = await bcrypt.hash(datos.password, salt);
    }

    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      datos,
      { new: true }
    ).select('-password');

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};


// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

