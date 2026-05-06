// ... (código anterior en el addEventListener de btnRegistrarSalida)

           // Asegúrate de que este código se ejecute después de que el DOM esté cargado
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

    if (btnRegistrarSalida) { // Si estamos en movimientos.html (donde existe este botón)
        btnRegistrarSalida.addEventListener('click', async () => {
            const pqr = document.getElementById('salidaPqr').value;
            const quienSeLoLleva = document.getElementById('salidaQuienSeLoLleva').value;
            const nombreMaterial = document.getElementById('salidaMaterial').value;
            const cantidad = document.getElementById('salidaCantidad').value;
            const observacion = document.getElementById('salidaObservacion').value;

            // --- Obtener la fecha y hora actual ---
            const ahora = new Date();
            // Formato de hora (ej. "14:35:00")
            const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            // Formato de fecha ISO (ej. "2023-10-27T14:35:00.000Z")
            const fechaMovimiento = ahora.toISOString();

            // Validación simple en el frontend
            if (!pqr || !quienSeLoLleva || !nombreMaterial || !cantidad) {
                alert('Por favor, completa todos los campos obligatorios para la salida.');
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
                        nombreMaterial: nombreMaterial,
                        cantidad: parseInt(cantidad), // Asegúrate de enviar la cantidad como número
                        observacion: observacion,
                        hora: horaActual,              // Envía la hora generada
                        fechaMovimiento: fechaMovimiento // Envía la fecha ISO generada
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
                }

                const nuevoMovimiento = await response.json();
                alert('¡Salida registrada exitosamente!');
                console.log('Movimiento registrado:', nuevoMovimiento);
                // Limpiar el formulario después del éxito
                document.getElementById('salidaPqr').value = '';
                document.getElementById('salidaQuienSeLoLleva').value = '';
                document.getElementById('salidaMaterial').value = '';
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
    // LÓGICA DE CARGA Y MOSTRAR MATERIALES (Original de tu script.js)
    // Se ejecuta solo si los elementos existen en la página (ej. en inventario.html)
    // =================================================================================
    const btnCargarMateriales = document.getElementById('btnCargarMateriales');
    const cuerpoTablaMateriales = document.getElementById('cuerpoTablaMateriales');

    async function cargarYMostrarMateriales() {
        if (!cuerpoTablaMateriales) { // Si no hay tabla, no hay donde mostrar
            console.log("Elemento 'cuerpoTablaMateriales' no encontrado en esta página.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/materiales');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const materiales = await response.json();
            cuerpoTablaMateriales.innerHTML = '';

            if (materiales.length === 0) {
                cuerpoTablaMateriales.innerHTML = '<tr><td colspan="7">No hay materiales registrados.</td></tr>';
                return;
            }

            materiales.forEach(material => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${material._id}</td>
                    <td>${material.nombre}</td>
                    <td>${material.cantidad}</td>
                    <td>${material.unidad}</td>
                    <td>${material.descripcion}</td>
                    <td>${new Date(material.fechaRegistro).toLocaleDateString()}</td>
                    <td>${material.registradoPor || 'N/A'}</td>
                `;
                cuerpoTablaMateriales.appendChild(fila);
            });

        } catch (error) {
            console.error('Error al cargar los materiales:', error);
            cuerpoTablaMateriales.innerHTML = `<tr><td colspan="7" style="color: red;">Error al cargar: ${error.message}</td></tr>`;
        }
    }

    // Solo añadir el listener si el botón existe en la página
    if (btnCargarMateriales) {
        btnCargarMateriales.addEventListener('click', cargarYMostrarMateriales);
    }
});