
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');  // renderiza views/index.pug
});


router.get('/login', (req, res) => {
  res.render('login');  // renderiza views/login.pug
});


router.get('/dashboard', (req, res) => {
  res.render('dashboard');  // renderiza views/dashboard.pug
});

module.exports = router;
