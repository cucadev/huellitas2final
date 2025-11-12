// =============================================================================
// IMPORTACIÓN DE MODELOS - Conexión con múltiples colecciones
// =============================================================================
const Empleado = require('../models/Empleado');
const Servicio = require('../models/Servicio'); // ← IMPORTAA MODELO SERVICIOS
// PROPÓSITO: 
//    - Empleado: Para operaciones CRUD de empleados
//    - Servicio: Para cargar servicios disponibles en los formularios
// RELACIÓN ENTRE MODELOS:
//    - Empleados y Servicios tienen relación "muchos a muchos"
//    - Un empleado puede brindar múltiples servicios
//    - Un servicio puede ser brindado por múltiples empleados
// ESTRUCTURA EN MONGODB:
//    - Empleado: { ..., servicios: ["id1", "id2"] } (array de IDs)
//    - Servicio: { name, description, price } (documentos independientes)

// =============================================================================
// CONTROLADOR PARA LA VISTA PRINCIPAL DE EMPLEADOS
// =============================================================================
exports.vistaEmpleados = async (req, res) => {
  try {
    // CARGAR EMPLEADOS CON SUS SERVICIOS (RELACIÓN CON POPULATE)
    const empleados = await Empleado.find({}).populate('servicios');
    // CONSULTA 1: Obtiene TODOS los empleados de MongoDB
    // POPULATE: Reemplaza los IDs de servicios con los documentos COMPLETOS
    //    - ANTES: empleado.servicios = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
    //    - DESPUÉS: empleado.servicios = [{name: "Consulta", price: 100}, {name: "Vacuna", price: 50}]
    // RESULTADO: Array de empleados con información completa de sus servicios
    
    // CARGAR TODOS LOS SERVICIOS DISPONIBLES PARA LOS FORMULARIOS
    const servicios = await Servicio.find({});
    // CONSULTA 2: Obtiene TODOS los servicios para los checkboxes
    // PROPÓSITO: Mostrar checkboxes de servicios en formularios de crear/editar
    // RELACIÓN: Los servicios se usan para que el usuario seleccione cuáles puede brindar cada empleado
    
    // RENDERIZADO DE LA VISTA PUG CON LOS DATOS
    res.render('empleados/empleados', {
      titulo: 'Gestión de Empleados',  // Título de la página
      empleados,                       // Lista de empleados con servicios poblados
      servicios                        // Lista de servicios para checkboxes
    });
    // RUTA VISTA: views/empleados/empleados.pug
    // RELACIÓN CON VIEW:
    //    - En empleados.pug: `each empleado in empleados` → Itera empleados
    //    - En empleados.pug: `empleado.servicios` → Muestra servicios asignados (gracias al populate)
    //    - En empleados.pug: `each servicio in servicios` → Crea checkboxes en formularios
    //    - En empleados.pug: Botones con onclick que llaman a funciones JavaScript
    
  } catch (error) {
    // MANEJO DE ERRORES: Si falla la consulta a la base de datos
    res.status(500).send('Error al cargar los empleados: ' + error.message);
  }
};

// =============================================================================
// CONTROLADOR PARA CREAR NUEVOS EMPLEADOS
// =============================================================================
exports.crearEmpleado = async (req, res) => {
  try {
    // EXTRAER DATOS DEL FORMULARIO
    const { dni, name, lastname, phone, role, servicios } = req.body;
    // DATOS OBLIGATORIOS: dni, name, lastname, phone, role (vienen del formulario)
    // DATOS OPCIONALES: servicios (checkboxes - pueden no estar presentes)
    // RELACIÓN CON VIEW:
    //    - En empleados.pug: form(action="/empleados" method="POST")
    //    - Campos obligatorios: dni, name, lastname, phone, role
    //    - Checkboxes: name="servicios" value=servicio._id (pueden ser múltiples)
    
    // =============================================================================
    // VALIDACIONES BACKEND
    // =============================================================================
    
    // VALIDAR CAMPOS OBLIGATORIOS NO VACÍOS
    if (!dni || !name || !lastname || !phone || !role) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Campos incompletos</h2>
            <p>Todos los campos marcados con * son obligatorios.</p>
            <ul>
              ${!dni ? '<li>❌ DNI es requerido</li>' : ''}
              ${!name ? '<li>❌ Nombre es requerido</li>' : ''}
              ${!lastname ? '<li>❌ Apellido es requerido</li>' : ''}
              ${!phone ? '<li>❌ Teléfono es requerido</li>' : ''}
              ${!role ? '<li>❌ Rol es requerido</li>' : ''}
            </ul>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR FORMATO DE TELÉFONO (SOLO NÚMEROS Y +, MÁXIMO 10 CARACTERES)
    const phoneClean = phone.toString().replace(/\s/g, '');
    const phoneRegex = /^\+?[0-9]+$/;
    if (!phoneRegex.test(phoneClean)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Formato de teléfono inválido</h2>
            <p>El teléfono solo puede contener números y opcionalmente el símbolo + al inicio.</p>
            <p><strong>Teléfono ingresado:</strong> ${phone}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÁXIMA DEL TELÉFONO (10 NÚMEROS MÁXIMO)
    const phoneWithoutPlus = phoneClean.startsWith('+') ? phoneClean.slice(1) : phoneClean;
    if (phoneWithoutPlus.length > 10) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Teléfono demasiado largo</h2>
            <p>El teléfono no puede tener más de 10 números (excluyendo el + opcional).</p>
            <p><strong>Números ingresados:</strong> ${phoneWithoutPlus.length} (máximo 10 permitidos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR ROL (QUE ESTÉ ENTRE LAS OPCIONES PERMITIDAS)
    const rolesPermitidos = ['veterinario', 'atencion', 'peluquero', 'jefe'];
    if (!rolesPermitidos.includes(role)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Rol inválido</h2>
            <p>El rol seleccionado no es válido.</p>
            <p><strong>Roles permitidos:</strong> veterinario, atencion, peluquero, jefe</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR FORMATO DE DNI (SOLO NÚMEROS, SIN PUNTOS NI ESPACIOS)
    const dniClean = dni.toString().replace(/[.\s]/g, '');
    const dniRegex = /^[0-9]+$/;
    if (!dniRegex.test(dniClean)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Formato de DNI inválido</h2>
            <p>El DNI solo puede contener números. No use puntos, espacios o letras.</p>
            <p><strong>DNI ingresado:</strong> ${dni}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÁXIMA DEL DNI (MÁXIMO 8 CARACTERES)
    if (dniClean.length > 8) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI demasiado largo</h2>
            <p>El DNI no puede tener más de 8 números.</p>
            <p><strong>DNI ingresado:</strong> ${dniClean.length} números (máximo 8 permitidos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÍNIMA DEL DNI (MÍNIMO 7 CARACTERES)
    if (dniClean.length < 7) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI demasiado corto</h2>
            <p>El DNI debe tener al menos 7 números.</p>
            <p><strong>DNI ingresado:</strong> ${dniClean.length} números (mínimo 7 requeridos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // CONVERSIÓN INTELIGENTE DE SERVICIOS A ARRAY (MANEJO DE CHECKBOXES)
    const serviciosArray = Array.isArray(servicios) ? servicios : 
                          servicios ? [servicios] : [];
    // LÓGICA DE CONVERSIÓN:
    //    - Si servicios es Array → Mantiene el array: ["id1", "id2"] (múltiples checkboxes marcados)
    //    - Si servicios es String → Convierte a array: ["id1"] (un solo checkbox marcado)
    //    - Si servicios es undefined/null → Array vacío: [] (ningún checkbox marcado)
    // PROPÓSITO: Normalizar los servicios siempre como array para MongoDB
    // RELACIÓN CON SERVICIOS: Guarda referencia a los IDs de servicios seleccionados

    // CREACIÓN DEL NUEVO EMPLEADO CON RELACIÓN A SERVICIOS
    const nuevoEmpleado = new Empleado({
      dni: dniClean, // USAR DNI LIMPIO (SIN PUNTOS NI ESPACIOS)
      name,
      lastname,
      phone: phoneClean, // USAR TELÉFONO LIMPIO
      role,
      servicios: serviciosArray  // Array normalizado de IDs de servicios
    });
    // CONSTRUCCIÓN: Crea nueva instancia del modelo Empleado
    // RELACIÓN CON SERVICIOS: Guarda referencia a servicios por sus IDs
    // ESTRUCTURA EN BD: { ..., servicios: ["id_servicio1", "id_servicio2"] }
    
    // GUARDAR EN LA BASE DE DATOS
    await nuevoEmpleado.save();
    // PERSISTENCIA: Guarda el nuevo empleado en MongoDB
    // RELACIÓN: Los IDs de servicios se guardan como referencia
    
    // REDIRECCIÓN DESPUÉS DEL ÉXITO
    res.redirect('/empleados');
    // FLUJO: Redirige a la vista principal de empleados
    // RESULTADO: Llama automáticamente a exports.vistaEmpleados
    // EFECTO VISUAL: Usuario ve el nuevo empleado en la tabla
    
  } catch (error) {
    // MANEJO DE ERRORES ESPECÍFICOS
    if (error.code === 11000) {
      // ERROR 11000: Violación de índice único (DNI duplicado)
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI duplicado</h2>
            <p>No se puede registrar un empleado con un DNI que ya existe.</p>
            <p><strong>DNI duplicado:</strong> ${error.keyValue.dni}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
      // MENSAJE: Error específico para DNI duplicado
      // RELACIÓN: El modelo Empleado tiene unique: true en dni
    }
    
    // ERROR GENÉRICO
    res.status(400).send('Error al crear empleado: ' + error.message);
  }
};

// =============================================================================
// CONTROLADOR PARA ACTUALIZAR EMPLEADOS EXISTENTES
// =============================================================================
exports.actualizarEmpleado = async (req, res) => {
  try {
    // EXTRAER DATOS DE LA SOLICITUD
    const { id } = req.params;      // ID del empleado a editar (viene de la URL)
    const { dni, name, lastname, phone, role, servicios } = req.body; // Nuevos datos
    
    // RELACIÓN CON VIEW:
    //    - En empleados.pug: form(id="formEditarEmpleado" method="POST")
    //    - JavaScript establece: form.action = `/empleados/editar/${id}`
    //    - El ${id} en la URL llega como req.params.id
    //    - Los campos se llenan con datos existentes via cargarDatosEditar()
    
    // =============================================================================
    // VALIDACIONES BACKEND
    // =============================================================================
    
    // VALIDAR CAMPOS OBLIGATORIOS NO VACÍOS
    if (!dni || !name || !lastname || !phone || !role) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Campos incompletos</h2>
            <p>Todos los campos marcados con * son obligatorios.</p>
            <ul>
              ${!dni ? '<li>❌ DNI es requerido</li>' : ''}
              ${!name ? '<li>❌ Nombre es requerido</li>' : ''}
              ${!lastname ? '<li>❌ Apellido es requerido</li>' : ''}
              ${!phone ? '<li>❌ Teléfono es requerido</li>' : ''}
              ${!role ? '<li>❌ Rol es requerido</li>' : ''}
            </ul>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR FORMATO DE TELÉFONO (SOLO NÚMEROS Y +, MÁXIMO 10 CARACTERES)
    const phoneClean = phone.toString().replace(/\s/g, '');
    const phoneRegex = /^\+?[0-9]+$/;
    if (!phoneRegex.test(phoneClean)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Formato de teléfono inválido</h2>
            <p>El teléfono solo puede contener números y opcionalmente el símbolo + al inicio.</p>
            <p><strong>Teléfono ingresado:</strong> ${phone}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÁXIMA DEL TELÉFONO (10 NÚMEROS MÁXIMO)
    const phoneWithoutPlus = phoneClean.startsWith('+') ? phoneClean.slice(1) : phoneClean;
    if (phoneWithoutPlus.length > 10) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Teléfono demasiado largo</h2>
            <p>El teléfono no puede tener más de 10 números (excluyendo el + opcional).</p>
            <p><strong>Números ingresados:</strong> ${phoneWithoutPlus.length} (máximo 10 permitidos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR ROL (QUE ESTÉ ENTRE LAS OPCIONES PERMITIDAS)
    const rolesPermitidos = ['veterinario', 'atencion', 'peluquero', 'jefe'];
    if (!rolesPermitidos.includes(role)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Rol inválido</h2>
            <p>El rol seleccionado no es válido.</p>
            <p><strong>Roles permitidos:</strong> veterinario, atencion, peluquero, jefe</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR FORMATO DE DNI (SOLO NÚMEROS, SIN PUNTOS NI ESPACIOS)
    const dniClean = dni.toString().replace(/[.\s]/g, '');
    const dniRegex = /^[0-9]+$/;
    if (!dniRegex.test(dniClean)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: Formato de DNI inválido</h2>
            <p>El DNI solo puede contener números. No use puntos, espacios o letras.</p>
            <p><strong>DNI ingresado:</strong> ${dni}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÁXIMA DEL DNI (MÁXIMO 8 CARACTERES)
    if (dniClean.length > 8) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI demasiado largo</h2>
            <p>El DNI no puede tener más de 8 números.</p>
            <p><strong>DNI ingresado:</strong> ${dniClean.length} números (máximo 8 permitidos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // VALIDAR LONGITUD MÍNIMA DEL DNI (MÍNIMO 7 CARACTERES)
    if (dniClean.length < 7) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI demasiado corto</h2>
            <p>El DNI debe tener al menos 7 números.</p>
            <p><strong>DNI ingresado:</strong> ${dniClean.length} números (mínimo 7 requeridos)</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }

    // CONVERSIÓN INTELIGENTE DE SERVICIOS A ARRAY (IGUAL QUE CREAR)
    const serviciosArray = Array.isArray(servicios) ? servicios :
                          servicios ? [servicios] : [];
    // MISMAS REGLAS:
    //    - Múltiples checkboxes → Array
    //    - Un checkbox → Array con un elemento
    //    - Ningún checkbox → Array vacío
    // RELACIÓN: Actualiza la relación empleado-servicios en la base de datos

    // ACTUALIZACIÓN EN LA BASE DE DATOS CON RELACIÓN A SERVICIOS
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      id,  // ID del empleado a actualizar
      {
        dni: dniClean, // USAR DNI LIMPIO (SIN PUNTOS NI ESPACIOS)
        name,
        lastname,
        phone: phoneClean, // USAR TELÉFONO LIMPIO
        role,
        servicios: serviciosArray  // Array normalizado de IDs de servicios
      },
      {
        new: true,           // Devuelve el documento ACTUALIZADO
        runValidators: true  // Ejecuta validaciones del modelo
      }
    );
    // BÚSQUEDA: Encuentra empleado por ID
    // ACTUALIZACIÓN: Modifica todos los campos incluyendo servicios
    // RELACIÓN: Actualiza los servicios que el empleado puede brindar
    // OPCIONES:
    //    - new: true → Devuelve el empleado actualizado
    //    - runValidators: true → Aplica validaciones del esquema

    // VERIFICAR SI EL EMPLEADO EXISTÍA
    if (!empleadoActualizado) {
      return res.status(404).send('Empleado no encontrado');
      // '404' - El empleado no existe o el ID es incorrecto
    }
    
    // REDIRECCIÓN DESPUÉS DE ACTUALIZAR
    res.redirect('/empleados');
    // FLUJO: Redirige a la vista principal
    // RESULTADO: Llama a exports.vistaEmpleados con datos actualizados
    
  } catch (error) {
    // MANEJO DE ERRORES (IGUAL QUE CREAR)
    if (error.code === 11000) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #d32f2f;">❌ Error: DNI duplicado</h2>
            <p>No se puede actualizar el empleado con un DNI que ya existe.</p>
            <p><strong>DNI duplicado:</strong> ${error.keyValue.dni}</p>
            <a href="/empleados" style="color: #762051;">← Volver a empleados</a>
          </body>
        </html>
      `);
    }
    res.status(400).send('Error al actualizar empleado: ' + error.message);
  }
};

// =============================================================================
// CONTROLADOR PARA ELIMINAR EMPLEADOS
// =============================================================================
exports.eliminarEmpleado = async (req, res) => {
  try {
    // EXTRAER ID DE LA URL
    const { id } = req.params;
    // RELACIÓN CON VIEW:
    //    - En empleados.pug: form(id="formEliminarEmpleado" method="POST")
    //    - JavaScript establece: form.action = `/empleados/eliminar/${id}`
    
    // ELIMINAR DE LA BASE DE DATOS
    const empleadoEliminado = await Empleado.findByIdAndDelete(id);
    // BÚSQUEDA: Encuentra empleado por ID
    // ELIMINACIÓN: Borra permanentemente de MongoDB
    // RELACIÓN CON SERVICIOS: Al eliminar empleado, se rompe la relación automáticamente

    // VERIFICAR SI EL EMPLEADO EXISTÍA
    if (!empleadoEliminado) {
      return res.status(404).send('Empleado no encontrado');
    }
    
    // REDIRECCIÓN DESPUÉS DE ELIMINAR
    res.redirect('/empleados');
    // FLUJO: Redirige a la vista principal
    // EFECTO VISUAL: El empleado desaparece de la tabla
    
  } catch (error) {
    res.status(500).send('Error al eliminar empleado: ' + error.message);
  }
};

// =============================================================================
// FUNCIONES API PARA AGENDA (ENDOPOINTS JSON) - RELACIÓN CON AGENDA
// =============================================================================

// OBTENER TODOS LOS EMPLEADOS (JSON)
exports.getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find({}).populate('servicios');
    res.status(200).json(empleados);
    // PROPÓSITO: Proveer datos para otras partes de la aplicación
    // USO: Agenda necesita lista de empleados para asignar citas
    // RELACIÓN: Agenda hace fetch a /empleados/api/empleados
    // RELACIÓN CON SERVICIOS: Populate para que agenda vea servicios completos
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER EMPLEADO POR ID (JSON)
exports.getEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findById(id).populate('servicios');
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleado);
    // PROPÓSITO: Obtener datos específicos de un empleado
    // RELACIÓN CON SERVICIOS: Populate para servicios completos
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER SOLO VETERINARIOS (PARA AGENDA) - FILTRO POR ROL
exports.getVeterinarios = async (req, res) => {
  try {
    const veterinarios = await Empleado.find({ role: 'veterinario' })
      .select('name lastname role dni phone');
    // FILTRO: Solo empleados con role 'veterinario'
    // PROYECCIÓN: .select() solo devuelve campos específicos (optimiza respuesta)
    // RELACIÓN: Agenda necesita solo veterinarios para asignar consultas médicas
    
    res.status(200).json(veterinarios);
    // PROPÓSITO: Agenda necesita lista de veterinarios para asignar consultas
    // RELACIÓN: Agenda hace fetch a /empleados/api/empleados/rol/veterinario
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER SOLO PELUQUEROS (PARA AGENDA) - FILTRO POR ROL
exports.getPeluqueros = async (req, res) => {
  try {
    const peluqueros = await Empleado.find({ role: 'peluquero' })
      .select('name lastname role dni phone');
    // FILTRO: Solo empleados con role 'peluquero'
    // RELACIÓN: Agenda necesita solo peluqueros para asignar servicios de peluquería
    
    res.status(200).json(peluqueros);
    // PROPÓSITO: Agenda necesita lista de peluqueros para asignar peluquería
    // RELACIÓN: Agenda hace fetch a /empleados/api/empleados/rol/peluquero
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};