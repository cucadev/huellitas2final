require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs'); // ← AÑADIR ESTO

const app = express();
const PORT = process.env.PORT || 3000;

// Importación de rutas
const clientesRoutes = require('./Backend/routes/ClienteRoutes');
const productRoutes = require('./Backend/routes/productRoutes');
const comprasRoutes = require('./Backend/routes/comprasRoutes');
const ventasRoutes = require('./Backend/routes/ventasRoutes');
const cajaRoutes = require('./Backend/routes/cajaRoutes');
const userRoutes = require('./Backend/routes/userRoutes');
const webRoutes = require('./Backend/routes/webRoutes');
const mascotaRoutes = require('./Backend/routes/mascotaRoutes');

//IMPORTACIONES DE RUTAS SERVICIO, EMPLEADOS Y AGENDA - Brian
const serviciosRoutes = require('./Backend/routes/servicioRoutes');
const empleadosRoutes = require('./Backend/routes/empleadoRoutes');
const agendaRoutes = require('./Backend/routes/agendaRoutes');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión:', err));

mongoose.connection.on('connected', () => {
  console.log('Base de datos usada:', mongoose.connection.name);
});

// Configuración de Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

// ✅ DIAGNÓSTICO: Agrega esto para verificar las rutas
console.log('📁 __dirname:', __dirname);
console.log('📂 Ruta de Public:', path.join(__dirname, 'Public'));

// ✅ CONFIGURACIÓN MEJORADA DE ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/images', express.static(path.join(__dirname, 'Public/images')));
app.use('/css', express.static(path.join(__dirname, 'Public/css')));
app.use('/js', express.static(path.join(__dirname, 'Public/js')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones y flash
app.use(session({
  secret: 'huellitasfelices',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.mensajeExito = req.flash('mensajeExito');
  res.locals.mensajeError = req.flash('mensajeError');
  next();
});

// ✅ RUTA DE DIAGNÓSTICO - Agrega esto ANTES de las otras rutas
app.get('/test-files', (req, res) => {
  console.log('🔍 Verificando estructura de archivos...');
  
  const publicPath = path.join(__dirname, 'Public');
  const imagesPath = path.join(__dirname, 'Public/images');
  
  try {
    const publicExists = fs.existsSync(publicPath);
    const imagesExists = fs.existsSync(imagesPath);
    
    console.log('📂 Public existe:', publicExists);
    console.log('📸 Images existe:', imagesExists);
    
    let imageFiles = [];
    if (imagesExists) {
      imageFiles = fs.readdirSync(imagesPath);
      console.log('🖼️ Archivos en images:', imageFiles);
    }

    // Verificar estructura completa
    const checkStructure = (dir, prefix = '') => {
      try {
        const items = fs.readdirSync(dir);
        console.log(`${prefix}${path.basename(dir)}/`);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            checkStructure(fullPath, prefix + '  ');
          } else {
            console.log(`${prefix}  📄 ${item}`);
          }
        });
      } catch (error) {
        console.log(`${prefix}❌ No se puede leer el directorio`);
      }
    };

    console.log('🌳 Estructura del proyecto:');
    checkStructure(__dirname);

    res.json({
      publicExists: publicExists,
      imagesExists: imagesExists,
      currentDir: __dirname,
      filesInImages: imageFiles,
      message: 'Revisa los logs de Render para ver la estructura completa'
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ MIDDLEWARE PARA LOGGING DE IMÁGENES - Agrega esto también
app.use((req, res, next) => {
  if (req.url.includes('.png') || req.url.includes('.jpg') || req.url.includes('.jpeg')) {
    console.log('🖼️ Solicitando imagen:', req.url);
    const imagePath = path.join(__dirname, 'Public', req.url);
    console.log('📁 Ruta física:', imagePath);
    console.log('📄 Existe:', fs.existsSync(imagePath));
  }
  next();
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/clientes', clientesRoutes);
app.use('/productos', productRoutes);
app.use('/compras', comprasRoutes);
app.use('/ventas', ventasRoutes);
app.use('/caja', cajaRoutes);
app.use('/mascotas', mascotaRoutes);
app.use('/', webRoutes);

// RUTAS DE SERVICIOS, EMPLEADOS Y AGENDA AGREGAR - Brian
app.use('/servicios', serviciosRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/agenda', agendaRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Visita https://tu-app.onrender.com/test-files para diagnosticar imágenes`);
});