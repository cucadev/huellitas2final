const Agenda = require('../models/Agenda');
const Cliente = require('../models/Cliente');

// VISTA PRINCIPAL DE AGENDA (RENDERIZA PUG CON CALENDARIO)
exports.vistaAgenda = async (req, res) => {
  try {
    res.render('agenda/agenda', {
      titulo: 'Agenda de Turnos'
    });
  } catch (error) {
    res.status(500).send('Error al cargar la agenda: ' + error.message);
  }
};

// OBTIENE CITAS EN UN RANGO DE FECHAS (PARA FULLCALENDAR)
exports.getAgendasByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    
    let query = {};
    if (start && end) {
      query.date = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }
    
    const agendas = await Agenda.find(query).sort({ date: 1, time: 1 });
    
    const events = agendas.map(agenda => {
      const dateStr = agenda.date.toISOString().split('T')[0];
      const startDateTime = `${dateStr}T${agenda.time}:00`;
      
      return {
        id: agenda._id.toString(),
        title: agenda.title,
        start: startDateTime,
        extendedProps: {
          dni_client: agenda.dni_client,
          name_client: agenda.name_client,
          lastname_client: agenda.lastname_client,
          email_client: agenda.email_client,
          phone_client: agenda.phone_client,
          address_client: agenda.address_client,
          city_client: agenda.city_client,
          pet_name: agenda.pet_name,
          pet_type: agenda.pet_type,
          professional: agenda.professional,
          observations: agenda.observations,
          status: agenda.status,
          time: agenda.time,
          date: dateStr
        }
      };
    });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREA UNA CITA NUEVA (PARA FULLCALENDAR - DEVUELVE JSON)
exports.createAgenda = async (req, res) => {
  try {
    const { dni_client, date, time, professional, ...otherData } = req.body;

    console.log('🎯 INICIANDO CREATE AGENDA ==================');
    console.log('🔍 DNI recibido:', dni_client);
    console.log('🏢 Entorno:', process.env.NODE_ENV);

    // DEBUG: Verificar el modelo Cliente
    console.log('🔍 INSPECCIONANDO MODELO CLIENTE:');
    console.log('- Campos del esquema:', Object.keys(Cliente.schema.paths));

    // BUSCAR EL CLIENTE EN TODOS LOS CAMPOS POSIBLES
    console.log('🔎 BUSCANDO CLIENTE EN TODOS LOS CAMPOS:');
    
    const busquedas = {
      por_dniCliente: await Cliente.findOne({ dniCliente: dni_client }),
      por_dni: await Cliente.findOne({ dni: dni_client }),
      totalClientes: await Cliente.countDocuments(),
      algunosClientes: await Cliente.find({}, 'dniCliente dni nombre apellido').limit(5)
    };

    console.log('📊 RESULTADOS BÚSQUEDA:', busquedas);

    // USAR EL CLIENTE ENCONTRADO EN CUALQUIER CAMPO
    let cliente = busquedas.por_dniCliente || busquedas.por_dni;

    if (!cliente) {
      console.log('❌ CLIENTE NO ENCONTRADO EN NINGÚN CAMPO');
      return res.status(404).json({ 
        message: "NO se encontró ningún cliente con el DNI proporcionado.",
        debug: {
          dniBuscado: dni_client,
          camposDisponibles: Object.keys(Cliente.schema.paths),
          algunosClientes: busquedas.algunosClientes
        }
      });
    }

    console.log('✅ CLIENTE ENCONTRADO:', {
      id: cliente._id,
      dniCliente: cliente.dniCliente,
      dni: cliente.dni,
      nombre: cliente.nombre,
      apellido: cliente.apellido
    });

    // VALIDACION DE DISPONIBILIDAD DEL VETERINARIO
    const citaExistente = await Agenda.findOne({
      date: new Date(date),
      time: time,
      professional: professional,
    });

    if (citaExistente) {
      return res.status(400).json({
        message: `El veterinario ${professional} ya tiene una cita agendada a las ${time} del ${date}.`
      });
    }

    // CREAR LA CITA CON LA REFERENCIA AL CLIENTE
    const agendaData = {
      ...otherData,
      date,
      time,
      professional,
      client: cliente._id,
      dni_client: dni_client,
      name_client: cliente.nombre,
      lastname_client: cliente.apellido,
      email_client: cliente.email,
      phone_client: cliente.telefono,
      address_client: cliente.direccion,
      city_client: cliente.city
    };

    const agenda = await Agenda.create(agendaData);
    
    // DEVOLVER EN FORMATO FULLCALENDAR
    const dateStr = agenda.date.toISOString().split('T')[0];
    const startDateTime = `${dateStr}T${agenda.time}:00`;
    
    const eventFormatted = {
      id: agenda._id.toString(),
      title: agenda.title,
      start: startDateTime,
      backgroundColor: agenda.backgroundColor,
      borderColor: agenda.borderColor,
      extendedProps: {
        dni_client: agenda.dni_client,
        name_client: agenda.name_client,
        lastname_client: agenda.lastname_client,
        email_client: agenda.email_client,
        phone_client: agenda.phone_client,
        address_client: agenda.address_client,
        city_client: agenda.city_client,
        pet_name: agenda.pet_name,
        pet_type: agenda.pet_type,
        professional: agenda.professional,
        observations: agenda.observations,
        status: agenda.status,
        time: agenda.time,
        date: dateStr
      }
    };
    
    res.status(201).json(eventFormatted);
  } catch (error) {
    console.error('💥 ERROR COMPLETO EN CREATE AGENDA:', error);
    res.status(500).json({ message: error.message });
  }
};

// ACTUALIZA UNA CITA EXISTENTE (PARA FULLCALENDAR - DEVUELVE JSON)
exports.updateAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { dni_client, ...otherData } = req.body;

    let updateData = { ...otherData };

    // SI SE ESTÁ CAMBIANDO EL DNI, BUSCAR EL NUEVO CLIENTE
    if (dni_client) {
      // BUSCAR EN AMBOS CAMPOS
      const cliente = await Cliente.findOne({ dniCliente: dni_client }) || 
                     await Cliente.findOne({ dni: dni_client });
      
      if (!cliente) {
        return res.status(404).json({ message: "NO se encontró ningún cliente con el DNI proporcionado." });
      }

      updateData = {
        ...updateData,
        client: cliente._id,
        dni_client: dni_client,
        name_client: cliente.nombre,
        lastname_client: cliente.apellido,
        email_client: cliente.email,
        phone_client: cliente.telefono,
        address_client: cliente.direccion,
        city_client: cliente.city
      };
    }

    const agenda = await Agenda.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!agenda) {
      return res.status(404).json({ message: "NO se encontró ninguna cita con el ID proporcionado para actualizar." });
    }
    
    res.status(200).json(agenda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ELIMINA UNA CITA (PARA FULLCALENDAR - DEVUELVE JSON)
exports.deleteAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const agenda = await Agenda.findByIdAndDelete(id);

    if (!agenda) {
      return res.status(404).json({ message: "NO se encontró ninguna cita con el ID proporcionado para eliminar." });
    }

    res.status(200).json({ message: "Cita eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};