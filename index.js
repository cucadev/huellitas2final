require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs'); // ← IMPORTANTE: Agregar esto

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

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/images', express.static(path.join(__dirname, 'Public/Images')));

// ✅ DIAGNÓSTICO COMPLETO DE IMÁGENES
app.use((req, res, next) => {
  if (req.url.match(/\.(png|jpg|jpeg|gif|ico)$/)) {
    const requestedImage = req.url;
    const possiblePaths = [
      path.join(__dirname, 'Public', requestedImage),
      path.join(__dirname, 'Public/Images', path.basename(requestedImage)),
      path.join(__dirname, 'Public/images', path.basename(requestedImage))
    ];
    
    console.log('🖼️ SOLICITUD DE IMAGEN:', requestedImage);
    console.log('🔍 Buscando en rutas:');
    possiblePaths.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p} → ${fs.existsSync(p) ? '✅ EXISTE' : '❌ NO EXISTE'}`);
    });
    console.log('---');
  }
  next();
});

// ✅ RUTA DE DIAGNÓSTICO COMPLETO
app.get('/debug-images', (req, res) => {
  const checkDirectory = (dirPath) => {
    try {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        const files = [];
        const directories = [];
        
        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          if (fs.statSync(fullPath).isDirectory()) {
            directories.push(item + '/');
          } else {
            files.push(item);
          }
        });
        
        return { 
          exists: true, 
          path: dirPath,
          directories: directories,
          files: files 
        };
      }
      return { exists: false, path: dirPath };
    } catch (error) {
      return { exists: false, error: error.message, path: dirPath };
    }
  };

  const structure = {
    proyecto: checkDirectory(__dirname),
    public: checkDirectory(path.join(__dirname, 'Public')),
    public_Images: checkDirectory(path.join(__dirname, 'Public/Images')),
    public_images: checkDirectory(path.join(__dirname, 'Public/images')),
    views: checkDirectory(path.join(__dirname, 'Views')),
    backend: checkDirectory(path.join(__dirname, 'Backend'))
  };

  console.log('🏗️ ESTRUCTURA COMPLETA DEL PROYECTO:');
  console.log(JSON.stringify(structure, null, 2));

  // Crear HTML para ver imágenes directamente
  let html = '<h1>Diagnóstico de Imágenes</h1>';
  
  if (structure.public_Images.exists && structure.public_Images.files.length > 0) {
    html += '<h2>Imágenes en Public/Images:</h2><div style="display: flex; flex-wrap: wrap; gap: 10px;">';
    structure.public_Images.files.forEach(file => {
      if (file.match(/\.(png|jpg|jpeg|gif)$/)) {
        html += `<div style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                  <img src="/images/${file}" style="max-width: 150px; max-height: 150px;" onerror="this.style.display=\\'none\\'">
                  <div>${file}</div>
                  <a href="/images/${file}" target="_blank">Ver imagen</a>
                </div>`;
      }
    });
    html += '</div>';
  } else {
    html += '<p style="color: red;">❌ No se encontraron imágenes en Public/Images</p>';
  }

  html += '<h2>Estructura completa:</h2><pre>' + JSON.stringify(structure, null, 2) + '</pre>';
  
  res.send(html);
});

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
  console.log(`🔍 Visita https://tu-app.onrender.com/debug-images para diagnóstico completo`);
});