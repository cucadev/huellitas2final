// ========================================
// DRIVER.JS - TOUR GUIADO DE LA AGENDA
// ========================================

let driverObj;

document.addEventListener('DOMContentLoaded', function() {
    // Acceder a driver desde el CDN
    const driver = window.driver.js.driver;

    // Inicializar Driver.js
    driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        steps: [
            {
                element: '#calendar',
                popover: {
                    title: '📅 Bienvenido a la Agenda Veterinaria',
                    description: 'Aquí puedes gestionar todas las citas de la veterinaria. Visualiza, crea, edita y elimina turnos de forma fácil e intuitiva.',
                    side: 'bottom',
                    align: 'center'
                }
            },
            {
                element: '.fc-toolbar-chunk:first-child',
                popover: {
                    title: '⬅️ ➡️ Navegación del Calendario',
                    description: 'Usa las flechas para moverte entre fechas.',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '.fc-nuevaCita-button',
                popover: {
                    title: '➕ Agendar Nuevo Turno',
                    description: 'Haz clic aquí para abrir el formulario y crear una nueva cita. También puedes hacer clic directamente en cualquier dia del calendario.',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '.fc-toolbar-chunk:last-child',
                popover: {
                    title: '🗓️ Vistas del Calendario',
                    description: 'Cambia entre vista mensual, semanal o diaria según tus necesidades. La vista semanal es ideal para ver los horarios detallados.',
                    side: 'bottom',
                    align: 'end'
                }
            },
            {
                popover: {
                    title: '🖱️ Interacción con el Calendario',
                    description: '<strong>Tips de uso:</strong><br>• <strong>Clic en dia u hora del calendario:</strong> Crea una nueva cita<br>• <strong>Clic en Cita:</strong> Ver/editar y Eliminar cita existente<br>• <strong>Arrastrar manteniendo click sobre la cita creada:</strong> Reagendar a otra fecha<br>• <strong>Nunca olvides de siempre chequear que todo esta correcto con la cita</strong>',
                    side: 'top',
                    align: 'center',
                    popoverClass: 'popover-ancho'
                }
            },
            {
                popover: {
                    title: '🎨 Colores de los Eventos',
                    description: '<strong>Los eventos se colorean automáticamente:</strong><br>• <span style="color: #28a745;">●</span> <strong>Verde:</strong> Cita en horario próximo<br>• <span style="color: #ffc107;">●</span> <strong>Amarillo:</strong> Cita muy próxima (alerta)<br>• <span style="color: #dc3545;">●</span> <strong>Rojo:</strong> Cita ya pasada',
                    side: 'top',
                    align: 'center'
                }
            }
        ],
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Anterior',
        doneBtnText: '✓ Finalizar',
        closeBtnText: '✕',
        progressText: '{{current}} de {{total}}'
    });

    // Evento del botón de ayuda
    document.getElementById('btnAyudaAgenda').addEventListener('click', function() {
        iniciarTourCompleto();
    });

    // Mostrar tour automáticamente la primera vez (opcional)
    // Descomenta las siguientes líneas si quieres que se muestre automáticamente
    // if (!localStorage.getItem('tourAgendaVisto')) {
    //     setTimeout(() => {
    //         iniciarTourCompleto();
    //         localStorage.setItem('tourAgendaVisto', 'true');
    //     }, 1000);
    // }
});

// ========================================
// TOUR COMPLETO DEL CALENDARIO
// ========================================
function iniciarTourCompleto() {
    driverObj.drive();
}

// ========================================
// TOUR DEL FORMULARIO DE CITA
// ========================================
function iniciarTourFormulario() {
    const driver = window.driver.js.driver;
    const driverFormulario = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        steps: [
            {
                element: '#titulo',
                popover: {
                    title: '📝 Título de la Cita',
                    description: 'Ingresa un título descriptivo para la cita. Ejemplo: "Consulta general", "Vacunación", "Control postoperatorio".',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#fecha',
                popover: {
                    title: '📅 Fecha de la Cita',
                    description: 'Selecciona la fecha en la que se realizará la consulta.',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#hora',
                popover: {
                    title: '🕒 Hora de la Cita',
                    description: 'Define la hora exacta de la cita. Asegúrate de no superponer horarios.',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#veterinario',
                popover: {
                    title: '👨‍⚕️ Profesional',
                    description: 'Selecciona el veterinario que atenderá la consulta.',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#seccionCliente',
                popover: {
                    title: '🔍 Buscar Cliente',
                    description: 'Ingresa el DNI del cliente y haz clic en la lupa 🔍. Los datos se completarán automáticamente si el cliente existe en el sistema.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#seccionMascota',
                popover: {
                    title: '🐾 Datos de la Mascota',
                    description: 'Completa el nombre, tipo de mascota y el motivo de la consulta. Esta información es importante para el historial médico.',
                    side: 'top',
                    align: 'start'
                }
            },
            {
                element: '#btnGuardarCita',
                popover: {
                    title: '💾 Guardar Cita',
                    description: 'Una vez completados todos los campos, haz clic aquí para guardar la cita. Aparecerá automáticamente en el calendario.',
                    side: 'top',
                    align: 'end'
                }
            }
        ],
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Anterior',
        doneBtnText: '✓ Entendido',
        closeBtnText: '✕',
        progressText: '{{current}} de {{total}}'
    });

    driverFormulario.drive();
}

// ========================================
// EXPORTAR PARA USAR DESDE AGENDA.JS
// ========================================
// Cuando se abre el modal de nueva cita por primera vez, 
// puedes llamar a iniciarTourFormulario() desde agenda.js