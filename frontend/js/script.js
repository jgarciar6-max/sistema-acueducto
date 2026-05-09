document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // FUNCIONES GLOBALES PARA NAVEGACIÓN (desde index.html o cualquier página)
    // =================================================================================

    // Declaradas en el objeto global 'window' para que sean accesibles desde onclick=""
    window.irReportes = function() { window.location.href = 'reportes.html'; };
    window.irInventario = function() { window.location.href = 'inventario.html'; };
    window.irMovimientos = function() { window.location.href = 'movimientos.html'; };
    window.irUsuarios = function() { window.location.href = 'usuarios.html'; };
    window.volver = function() { window.location.href = 'index.html'; };

    // =================================================================================
    // LÓGICA ESPECÍFICA PARA LA PÁGINA DE MOVIMIENTOS (movimientos.html)
    // =================================================================================

    const btnRegistrarSalida = document.getElementById('btnRegistrarSalida');
    const btnRegistrarEntrada = document.getElementById('btnRegistrarEntrada');

    // --- Lógica para cargar datalist de Materiales en movimientos.html ---
    const salidaMaterialNombreInput = document.getElementById('salidaMaterialNombre');
    const salidaMaterialIdInput = document.getElementById('salidaMaterialId');
    const materialesDatalist = document.getElementById('materialesDisponibles');

    let todosLosMateriales = []; // Para almacenar todos los materiales cargados

    async function cargarMaterialesParaDatalist() {
        // Solo ejecuta si los elementos del formulario de salida existen en la página
        if (!salidaMaterialNombreInput || !materialesDatalist) return; 

        try {
            const response = await fetch('http://localhost:3000/api/materiales'); // Ruta para obtener TODOS los materiales
            if (!response.ok) throw new Error('Error al cargar materiales para el datalist.');
            
            todosLosMateriales = await response.json(); // Guardamos todos los materiales
            materialesDatalist.innerHTML = ''; // Limpiar opciones anteriores

            todosLosMateriales.forEach(material => {
                const option = document.createElement('option');
                option.value = material.nombre;
                // No es necesario añadir el ID aquí, lo manejaremos con el evento 'input'
                materialesDatalist.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando materiales para el datalist:', error);
        }
    }

    // Evento para cuando el usuario escribe o selecciona un material en el input de salida
    if (salidaMaterialNombreInput) {
        salidaMaterialNombreInput.addEventListener('input', () => {
            const nombreSeleccionado = salidaMaterialNombreInput.value;
            // Busca el material en la lista cargada por su nombre
            const materialEncontrado = todosLosMateriales.find(m => m.nombre === nombreSeleccionado);

            if (materialEncontrado) {
                salidaMaterialIdInput.value = materialEncontrado._id; // Guarda el ID del material
            } else {
                salidaMaterialIdInput.value = ''; // Limpia el ID si no hay coincidencia
            }
        });

        // Llamar a la función para cargar los materiales cuando la página de movimientos.html se carga
        cargarMaterialesParaDatalist();
    }
    // --- FIN DE LÓGICA para datalist ---


    if (btnRegistrarSalida) { // Si estamos en movimientos.html (donde existe este botón)
        btnRegistrarSalida.addEventListener('click', async () => {
            const pqr = document.getElementById('salidaPqr').value;
            const quienSeLoLleva = document.getElementById('salidaQuienSeLoLleva').value;
            const materialId = document.getElementById('salidaMaterialId').value; // Obtenemos el ID del campo oculto
            const cantidad = document.getElementById('salidaCantidad').value;
            const observacion = document.getElementById('salidaObservacion').value;

            // --- Obtener la fecha y hora actual ---
            const ahora = new Date(); // Captura la fecha y hora local del navegador

            // Validación: Asegúrate de que se haya seleccionado o escrito un material válido y que tenga un ID
            if (!pqr || !quienSeLoLleva || !materialId || !cantidad) {
                alert('Por favor, completa todos los campos obligatorios para la salida (incluyendo seleccionar un material válido de la lista).');
                return;
            }
            if (isNaN(cantidad) || parseInt(cantidad) <= 0) {
                alert('La cantidad debe ser un número válido mayor que cero.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/movimientos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pqr: pqr,
                        quienSeLoLleva: quienSeLoLleva,
                        material: materialId, // ENVIAMOS EL ID DEL MATERIAL AL BACKEND
                        nombreMaterial: salidaMaterialNombreInput.value, // Enviamos también el nombre para el registro de movimiento
                        cantidad: parseInt(cantidad),
                        observacion: observacion,
                        fechaMovimiento: ahora.toISOString(), // Enviamos la fecha y hora completas como ISO string
                        tipo: 'salida' // Indicamos que es una salida
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensaje || `Error del servidor: ${response.status}`);
                }

                const nuevoMovimiento = await response.json();
                alert('¡Salida registrada exitosamente y stock actualizado!'); // Mensaje de éxito mejorado
                console.log('Movimiento registrado y stock actualizado:', nuevoMovimiento);
                // Limpiar el formulario después del éxito
                document.getElementById('salidaPqr').value = '';
                document.getElementById('salidaQuienSeLoLleva').value = '';
                document.getElementById('salidaMaterialNombre').value = ''; // Limpiar el input de nombre
                document.getElementById('salidaMaterialId').value = '';     // Limpiar el ID oculto
                document.getElementById('salidaCantidad').value = '';
                document.getElementById('salidaObservacion').value = '';

            } catch (error) {
                console.error('Error al registrar la salida:', error);
                alert('Error al registrar la salida: ' + error.message);
            }
        });
    }

    // Lógica para registrar ENTRADAS (similar a las salidas, pero con datos y ruta si es diferente)
    if (btnRegistrarEntrada) { // Si estamos en movimientos.html
        btnRegistrarEntrada.addEventListener('click', async () => {
            const factura = document.getElementById('entradaFactura').value;
            const nombreMaterial = document.getElementById('entradaMaterial').value;
            const cantidad = document.getElementById('entradaCantidad').value;
            const observacion = document.getElementById('entradaObservacion').value;

            if (!factura || !nombreMaterial || !cantidad) {
                alert('Por favor, completa todos los campos obligatorios para la entrada.');
                return;
            }
            if (isNaN(cantidad) || parseInt(cantidad) <= 0) {
                alert('La cantidad debe ser un número válido mayor que cero.');
                return;
            }
            // NOTA: Tu backend de 'movimientos' usa 'pqr' como identificador, no 'factura'.
            // Si las entradas son también 'movimientos', deberías adaptar el JSON
            // para que coincida con los campos de tu modelo Movimiento.
            // Quizás el 'pqr' se convertiría en 'factura' para las entradas o habría un campo 'tipo'
            // Considera cómo tu backend manejará las entradas vs. salidas.
            alert('Lógica para registrar entrada aún no implementada completamente en el frontend. Revisa el código.');
            console.log('Datos de entrada:', { factura, nombreMaterial, cantidad, observacion });
        });
    }

    // =================================================================================
    // LÓGICA DE CARGA Y MOSTRAR MATERIALES (Para inventario.html)
    // =================================================================================
    const btnCargarMateriales = document.getElementById('btnCargarMateriales');
    const cuerpoTablaMateriales = document.getElementById('cuerpoTablaMateriales');
    const buscadorInput = document.getElementById('buscadorInput'); 

    async function cargarYMostrarMateriales(terminoBusqueda = '') {
        if (!cuerpoTablaMateriales) { // Si no hay tabla, no hay donde mostrar
            // console.log("Elemento 'cuerpoTablaMateriales' no encontrado en esta página."); // Comentado para evitar log innecesario en otras páginas
            return;
        }

        try {
            let url = 'http://localhost:3000/api/materiales';
            if (terminoBusqueda) {
                url = `http://localhost:3000/api/materiales/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const materiales = await response.json();
            cuerpoTablaMateriales.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos resultados

            if (materiales.length === 0) {
                cuerpoTablaMateriales.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay materiales registrados con ese nombre.</td></tr>';
                return;
            }

           materiales.forEach(material => {

    const fila = document.createElement('tr');

    let estado = '🟢 Disponible';

    if (material.cantidad === 0) {
        estado = '🔴 Agotado';
    } else if (material.cantidad <= material.stockMinimo) {
        estado = '🟡 Stock Bajo';
    }

    fila.innerHTML = `
        <td>${material._id}</td>
        <td>${material.nombre}</td>
        <td>${material.cantidad}</td>
        <td>${material.unidad}</td>
        <td>${material.descripcion}</td>
        <td>${new Date(material.fechaRegistro).toLocaleDateString()}</td>
        <td>${material.registradoPor || 'N/A'}</td>
        <td>${estado}</td>
    `;

    cuerpoTablaMateriales.appendChild(fila);
});
        } catch (error) {
            console.error('Error al cargar o buscar materiales:', error);
            cuerpoTablaMateriales.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">Error al cargar/buscar: ${error.message}</td></tr>`;
        }
    }

    // Listener para el botón "Cargar Materiales" en inventario.html
    if (btnCargarMateriales) {
        btnCargarMateriales.addEventListener('click', () => {
            if (buscadorInput) { 
                buscadorInput.value = ''; // Limpiar el buscador al cargar todos
            }
            cargarYMostrarMateriales(); // Cargar todos los materiales
        });
    }

    // Función 'buscar' que se llamará desde el onclick del botón en inventario.html
    window.buscar = function() {
        if (buscadorInput && cuerpoTablaMateriales) { 
            const termino = buscadorInput.value.trim(); 
            cargarYMostrarMateriales(termino); 
        } else {
            // console.log("Elementos 'buscadorInput' o 'cuerpoTablaMateriales' no encontrados. Asegúrate de estar en inventario.html."); // Comentado para evitar log innecesario
        }
    };
    
    // Opcional: Cargar todos los materiales al inicio cuando la página de inventario se carga
    if (cuerpoTablaMateriales) { 
        cargarYMostrarMateriales();
    }


    // =================================================================================
    // LÓGICA DE CARGA Y MOSTRAR REPORTES (Para reportes.html)
    // Asumo que esta lógica está en tu script.js y que existe un cuerpoTablaReportes
    // =================================================================================
    const cuerpoTablaReportes = document.getElementById('cuerpoTablaReportes');
    const buscadorPQRInput = document.getElementById('buscadorPQR');
    const btnCargarTodosReportes = document.getElementById('btnCargarTodosReportes'); // Si tienes un botón para cargar todos los reportes

    async function cargarYMostrarReportes(terminoPQR = '') {
        if (!cuerpoTablaReportes) {
            // console.log("Elemento 'cuerpoTablaReportes' no encontrado en esta página.");
            return;
        }

        try {
            let url = 'http://localhost:3000/api/movimientos'; // Ruta para obtener TODOS los movimientos
            if (terminoPQR) {
                // Si hay un término de búsqueda por PQR
                url = `http://localhost:3000/api/movimientos/buscar?pqr=${encodeURIComponent(terminoPQR)}`; // Asumo que tienes una ruta para buscar por PQR
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const movimientos = await response.json();
            cuerpoTablaReportes.innerHTML = ''; // Limpiar la tabla

            if (movimientos.length === 0) {
                cuerpoTablaReportes.innerHTML = '<tr><td colspan="9" style="text-align: center;">No hay reportes de salida registrados.</td></tr>'; // Asegúrate que el colspan sea correcto
                return;
            }

            movimientos.forEach(movimiento => {
                const fila = document.createElement('tr');
                
                // --- Formateo de Fecha y Hora (CORREGIDO) ---
                const fechaHora = new Date(movimiento.fechaMovimiento);

                const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
                const fechaFormateada = fechaHora.toLocaleDateString('es-ES', opcionesFecha); 

                const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
                const horaFormateada = fechaHora.toLocaleTimeString('es-ES', opcionesHora); 
                // --- FIN Formateo ---

                fila.innerHTML = `
                    <td>${movimiento.pqr}</td>
                    <td>${movimiento.quienSeLoLleva}</td>
                    <td>${movimiento.nombreMaterial || 'N/A'}</td> <!-- Usa nombreMaterial que enviamos ahora -->
                    <td>${movimiento.cantidad}</td>
                    <td>${movimiento.unidad || 'N/A'}</td>
                    <td>${movimiento.observacion || 'Sin Observación'}</td>
                    <td>${movimiento.firma || 'No registrada'}</td>
                    <td>${horaFormateada}</td>        
                    <td>${fechaFormateada}</td>       
                `;
                cuerpoTablaReportes.appendChild(fila);
            });

        } catch (error) {
            console.error('Error al cargar o buscar reportes:', error);
            cuerpoTablaReportes.innerHTML = `<tr><td colspan="9" style="color: red; text-align: center;">Error al cargar/buscar: ${error.message}</td></tr>`;
        }
    }

    // Listener para el botón "Buscar Reporte" en reportes.html
    window.buscarReporte = function() { // Asumo que tienes una función global llamada 'buscarReporte'
        if (buscadorPQRInput && cuerpoTablaReportes) { 
            const termino = buscadorPQRInput.value.trim(); 
            cargarYMostrarReportes(termino); 
        }
    };

    // Listener para el botón "Cargar Todos los Reportes" en reportes.html
    if (btnCargarTodosReportes) {
        btnCargarTodosReportes.addEventListener('click', () => {
            if (buscadorPQRInput) {
                buscadorPQRInput.value = ''; // Limpiar el buscador
            }
            cargarYMostrarReportes(); // Cargar todos sin filtro
        });
    }

    // Opcional: Cargar todos los reportes al inicio cuando la página de reportes se carga
    if (cuerpoTablaReportes) { 
        cargarYMostrarReportes();
    }
    // =================================================================================
// ÚLTIMAS ACCIONES EN INDEX.HTML
// =================================================================================

const ultimasAcciones = document.getElementById('ultimasAcciones');

async function cargarUltimasAcciones() {

    if (!ultimasAcciones) return;

    try {

        const response = await fetch('http://localhost:3000/api/movimientos');

        if (!response.ok) {
            throw new Error('Error cargando movimientos');
        }

        const movimientos = await response.json();

        ultimasAcciones.innerHTML = '';

        // Mostrar SOLO los últimos 5 movimientos
        const ultimos = movimientos.slice(-5).reverse();

        ultimos.forEach(mov => {

            const fecha = new Date(mov.fechaMovimiento);

            const hora = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const p = document.createElement('p');

            p.innerHTML = `
                [${hora}] ${mov.quienSeLoLleva} - 
                Sacó ${mov.cantidad} de ${mov.nombreMaterial}
            `;

            ultimasAcciones.appendChild(p);

        });

    } catch (error) {

        console.error(error);

        ultimasAcciones.innerHTML = `
            <p>Error cargando movimientos</p>
        `;
    }
}

// CARGAR AL INICIAR
cargarUltimasAcciones();
    // =================================================================================
// DASHBOARD PRINCIPAL (index.html)
// =================================================================================

async function cargarDashboard() {

    const totalProductos = document.getElementById('totalProductos');
   const stockBajoElement = document.getElementById('stockBajo');
const ultimoMovimiento = document.getElementById('ultimoMovimiento');
stockBajoElement.textContent = stockBajo;
const responseMov = await fetch('http://localhost:3000/api/movimientos');

if (responseMov.ok) {

    const movimientos = await responseMov.json();

    if (movimientos.length > 0) {

        const ultimo = movimientos[movimientos.length - 1];

        const fecha = new Date(ultimo.fechaMovimiento);

        const hora = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        ultimoMovimiento.textContent = hora;

    } else {

        ultimoMovimiento.textContent = 'Sin datos';

    }
}

    // Si no estamos en index.html
    if (!totalProductos || !stockBajo || !ultimoMovimiento) return;

    try {

        // =========================
        // CARGAR MATERIALES
        // =========================
        const responseMateriales = await fetch('http://localhost:3000/api/materiales');
        const materiales = await responseMateriales.json();

        // TOTAL PRODUCTOS
        totalProductos.textContent = materiales.length;

        // STOCK BAJO
        const bajos = materiales.filter(material =>
            material.cantidad <= Number(material.stockMinimo)
        );

        stockBajo.textContent = bajos.length;

        // =========================
        // CARGAR MOVIMIENTOS
        // =========================
        const responseMovimientos = await fetch('http://localhost:3000/api/movimientos');
        const movimientos = await responseMovimientos.json();

        if (movimientos.length > 0) {

            const ultimo = movimientos[movimientos.length - 1];

            const fecha = new Date(ultimo.fechaMovimiento);

            ultimoMovimiento.textContent =
                fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

        } else {

            ultimoMovimiento.textContent = 'Sin datos';
        }

    } catch (error) {

        console.error('Error cargando dashboard:', error);
    }
}

// CARGAR DASHBOARD
cargarDashboard();
});