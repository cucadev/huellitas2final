const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Mostrar formulario login
router.get('/login', (req, res) => {
  res.render('login');  
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.obtenerUsuarios);
router.get('/:id', userController.obtenerUsuarioPorId);
router.put('/:id', userController.actualizarUsuario);
router.delete('/:id', userController.eliminarUsuario);



module.exports = router;