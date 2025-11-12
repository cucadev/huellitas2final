// =============================================================================
// IMPORTACIÓN DEL MODELO - Conexión con la base de datos
// =============================================================================
const Servicio = require('../models/Servicio');
// PROPÓSITO: Importa el modelo de MongoDB que define la estructura de los servicios
// RELACIÓN: Conecta el controller con la base de datos a través del modelo
// UBICACIÓN: ../models/Servicio.js (define el esquema de datos)

// =============================================================================
// CONTROLADOR PARA LA VISTA PRINCIPAL DE SERVICIOS
// =============================================================================
exports.vistaServicios = async (req, res) => {
  // 'async' indica que esta función maneja operaciones asíncronas (base de datos)
  try {
    // CONSULTA A LA BASE DE DATOS: Obtener TODOS los servicios
    const servicios = await Servicio.find({});
    // 'await' pausa la ejecución hasta que MongoDB devuelva los datos
    // 'Servicio.find({})' busca todos los documentos en la colección 'servicios'
    // RESULTADO: Array con todos los servicios de la base de datos
    
    // RENDERIZADO DE LA VISTA PUG CON LOS DATOS
    res.render('servicios/servicios', {
      titulo: 'Servicios Veterinarios',  // Título que se muestra en el navegador
      servicios  // Pasa los servicios a la vista para que los muestre
    });
    // PROPÓSITO: Generar HTML dinámico con los datos de la base de datos
    // RUTA VISTA: views/servicios/servicios.pug
    // RELACIÓN CON VIEW: 
    //    - En servicios.pug: `h1= titulo` muestra "Servicios Veterinarios"
    //    - En servicios.pug: `each servicio in servicios` itera sobre cada servicio
    //    - En servicios.pug: `td= servicio.name` muestra nombre de cada servicio
    //    - En servicios.pug: Los botones "Editar/Eliminar" tienen onclick que llama a funciones JavaScript
    
  } catch (error) {
    // MANEJO DE ERRORES: Si algo falla en la consulta a la base de datos
    res.status(500).send('Error al cargar los servicios: ' + error.message);
    // '500' es código de error interno del servidor
    // 'error.message' muestra el mensaje específico del error
  }
};

// =============================================================================
// CONTROLADOR PARA CREAR NUEVOS SERVICIOS
// =============================================================================
exports.crearServicio = async (req, res) => {
  try {
    // EXTRAER DATOS DEL FORMULARIO
    const { name, description, price } = req.body;
    // 'req.body' contiene los datos enviados por el formulario POST
    // Desestructuración: extrae name, description y price del objeto req.body
    // RELACIÓN CON VIEW: 
    //    - En servicios.pug: form(action="/servicios" method="POST")
    //    - En servicios.pug: input(name="name") → llega como req.body.name
    //    - En servicios.pug: textarea(name="description") → req.body.description
    //    - En servicios.pug: input(name="price") → req.body.price
    
    // ==================== VALIDACIÓN 1: CAMPOS OBLIGATORIOS ====================
    if (!name || !description || !price) {
      // Si alguno de los campos está vacío o undefined
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Campos incompletos</h2>
            <p>Todos los campos son obligatorios:</p>
            <ul>
              ${!name ? '<li>Nombre del servicio</li>' : ''}
              ${!description ? '<li>Descripción</li>' : ''}
              ${!price ? '<li>Precio</li>' : ''}
            </ul>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
      // '400' es código de "Bad Request" - solicitud incorrecta
      // Muestra una página HTML con los campos que faltan
      // Template strings dinámicos: solo muestra los campos que están vacíos
    }
    
    // ==================== VALIDACIÓN 2: PRECIO VÁLIDO ====================
    if (isNaN(price) || parseFloat(price) < 0) {
      // 'isNaN(price)' verifica si price NO es un número
      // 'parseFloat(price) < 0' verifica si el precio es negativo
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Precio inválido</h2>
            <p>El precio debe ser un número mayor o igual a 0.</p>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
    }

    // ==================== CREACIÓN DEL NUEVO SERVICIO ====================
    const nuevoServicio = new Servicio({ 
      name: name.trim(),           // '.trim()' elimina espacios en blanco al inicio/final
      description: description.trim(), 
      price: parseFloat(price)     // Convierte el string a número decimal
    });
    // CONSTRUCCIÓN: Crea una nueva instancia del modelo Servicio
    // LIMPIEZA: .trim() elimina espacios innecesarios
    // CONVERSIÓN: parseFloat() convierte string a número
    
    // GUARDAR EN LA BASE DE DATOS
    await nuevoServicio.save();
    // PERSISTENCIA: Guarda el nuevo servicio en la colección de MongoDB
    // OPERACIÓN ASÍNCRONA: Espera a que se complete el guardado
    
    // REDIRECCIÓN DESPUÉS DEL ÉXITO
    res.redirect('/servicios');
    // FLUJO: Redirige al usuario de vuelta a la lista de servicios
    // RESULTADO: Llama automáticamente a exports.vistaServicios
    // EFECTO VISUAL: El usuario ve el nuevo servicio en la tabla
    
  } catch (error) {
    // ==================== MANEJO DE ERRORES ESPECÍFICOS ====================
    if (error.code === 11000) {
      // ERROR 11000: Violación de índice único en MongoDB (nombre duplicado)
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Servicio duplicado</h2>
            <p>No se puede tener 2 servicios con el mismo nombre.</p>
            <p><strong>Servicio duplicado:</strong> ${error.keyValue.name}</p>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
      // 'error.keyValue.name' contiene el nombre que causó el duplicado
    }
    
    // ERROR GENÉRICO: Cualquier otro tipo de error
    res.status(400).send('Error al crear servicio: ' + error.message);
  }
};

// =============================================================================
// CONTROLADOR PARA ACTUALIZAR SERVICIOS EXISTENTES
// =============================================================================
exports.actualizarServicio = async (req, res) => {
  try {
    // EXTRAER DATOS DE LA SOLICITUD
    const { id } = req.params;           // ID del servicio a editar (viene de la URL)
    const { name, description, price } = req.body;  // Nuevos datos del formulario
    
    // RELACIÓN CON VIEW:
    //    - En servicios.pug: form(id="formEditarServicio" method="POST")
    //    - En servicios.pug: JavaScript establece form.action = `/servicios/editar/${id}`
    //    - El ${id} en la URL llega como req.params.id
    //    - Los campos del modal se llenan con los datos existentes via JavaScript
    
    // ==================== VALIDACIONES (IGUAL QUE EN CREAR) ====================
    if (!name || !description || !price) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Campos incompletos</h2>
            <p>Todos los campos son obligatorios:</p>
            <ul>
              ${!name ? '<li>Nombre del servicio</li>' : ''}
              ${!description ? '<li>Descripción</li>' : ''}
              ${!price ? '<li>Precio</li>' : ''}
            </ul>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
    }
    
    if (isNaN(price) || parseFloat(price) < 0) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Precio inválido</h2>
            <p>El precio debe ser un número mayor o igual a 0.</p>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
    }

    // ==================== ACTUALIZACIÓN EN LA BASE DE DATOS ====================
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,  // ID del documento a actualizar
      { 
        name: name.trim(), 
        description: description.trim(), 
        price: parseFloat(price) 
      }, 
      { 
        new: true,           // Devuelve el documento ACTUALIZADO (no el viejo)
        runValidators: true  // Ejecuta las validaciones definidas en el modelo
      }
    );
    // BÚSQUEDA: Encuentra el servicio por su ID único de MongoDB
    // ACTUALIZACIÓN: Modifica los campos con los nuevos valores
    // OPCIONES: 
    //    - new: true → Devuelve el documento actualizado
    //    - runValidators: true → Aplica validaciones del esquema

    // VERIFICAR SI EL SERVICIO EXISTÍA
    if (!servicioActualizado) {
      return res.status(404).send('Servicio no encontrado');
      // '404' es código "Not Found" - el recurso no existe
    }
    
    // REDIRECCIÓN DESPUÉS DE ACTUALIZAR
    res.redirect('/servicios');
    // FLUJO: Redirige a la vista principal
    // RESULTADO: Llama a exports.vistaServicios que renderiza la tabla actualizada
    // EFECTO VISUAL: El usuario ve los cambios reflejados en la tabla
    
  } catch (error) {
    // MANEJO DE ERRORES (IGUAL QUE EN CREAR)
    if (error.code === 11000) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Servicio duplicado</h2>
            <p>No se puede actualizar el servicio con un nombre que ya existe.</p>
            <p><strong>Servicio duplicado:</strong> ${error.keyValue.name}</p>
            <a href="/servicios" style="color: #762051;">← Volver a servicios</a>
          </body>
        </html>
      `);
    }
    res.status(400).send('Error al actualizar servicio: ' + error.message);
  }
};

// =============================================================================
// CONTROLADOR PARA ELIMINAR SERVICIOS
// =============================================================================
exports.eliminarServicio = async (req, res) => {
  try {
    // EXTRAER ID DE LA URL
    const { id } = req.params;
    // RELACIÓN CON VIEW:
    //    - En servicios.pug: form(id="formEliminarServicio" method="POST")  
    //    - En servicios.pug: JavaScript establece form.action = `/servicios/eliminar/${id}`
    //    - El ${id} en la URL llega como req.params.id
    
    // ELIMINAR DE LA BASE DE DATOS
    const servicioEliminado = await Servicio.findByIdAndDelete(id);
    // BÚSQUEDA: Encuentra el servicio por ID
    // ELIMINACIÓN: Borra permanentemente el documento de MongoDB

    // VERIFICAR SI EL SERVICIO EXISTÍA
    if (!servicioEliminado) {
      return res.status(404).send('Servicio no encontrado');
      // '404' - El servicio ya no existe o el ID es incorrecto
    }
    
    // REDIRECCIÓN DESPUÉS DE ELIMINAR
    res.redirect('/servicios');
    // FLUJO: Redirige a la vista principal
    // RESULTADO: Llama a exports.vistaServicios que renderiza la tabla sin el servicio eliminado
    // EFECTO VISUAL: El servicio desaparece de la tabla
    
  } catch (error) {
    // MANEJO DE ERRORES
    res.status(500).send('Error al eliminar servicio: ' + error.message);
    // '500' - Error interno del servidor (problema de base de datos)
  }
};