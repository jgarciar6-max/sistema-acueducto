document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos referencias a los elementos HTML
    const pqrBuscadorInput = document.getElementById('pqrBuscadorInput');
    const btnBuscarReporte = document.getElementById('btnBuscarReporte');
    const btnCargarTodosLosReportes = document.getElementById('btnCargarTodosLosReportes');
    const cuerpoTablaReportes = document.getElementById('cuerpoTablaReportes');

    // Función asíncrona para cargar y mostrar los reportes
    async function cargarYMostrarReportes(pqr = '') { // 'pqr' es opcional, si está vacío carga todos
        try {
            let url = 'http://localhost:3000/api/movimientos'; // URL base para todos los movimientos

            if (pqr) { // Si se proporcionó un PQR, usamos la ruta de búsqueda específica
                url = `http://localhost:3000/api/movimientos/buscar?pqr=${encodeURIComponent(pqr)}`;
            }

            const response = await fetch(url);

            if (!response.ok) { // Si la respuesta no es OK (ej. 404, 500)
                throw new Error(`Error al obtener reportes: ${response.status} - ${response.statusText}`);
            }

            const movimientos = await response.json(); // Convertimos la respuesta a JSON

            cuerpoTablaReportes.innerHTML = ''; // Limpiamos el cuerpo de la tabla antes de añadir nuevos datos

            if (movimientos.length === 0) {
                // Si no hay movimientos, mostramos un mensaje en la tabla
                cuerpoTablaReportes.innerHTML = '<tr><td colspan="9" style="text-align: center;">No se encontraron reportes con ese criterio.</td></tr>';
                return;
            }

            // Recorremos cada movimiento y creamos una fila en la tabla
            movimientos.forEach(movimiento => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${movimiento.pqr}</td>
                    <td>${movimiento.quienSeLoLleva}</td>
                    <td>${movimiento.nombreMaterial}</td>
                    <td>${movimiento.cantidad}</td>
                    <td>${movimiento.unidad || 'N/A'}</td> <!-- Si no hay unidad, muestra N/A -->
                    <td>${movimiento.observacion || 'Sin observación'}</td>
                    <td>${movimiento.firma || 'No registrada'}</td>
                    <td>${movimiento.hora}</td>
                    <td>${new Date(movimiento.fechaMovimiento).toLocaleDateString()}</td>
                `;
                cuerpoTablaReportes.appendChild(fila); // Agregamos la fila a la tabla
            });

        } catch (error) {
            console.error('Error al cargar los reportes:', error);
            cuerpoTablaReportes.innerHTML = `<tr><td colspan="9" style="color: red; text-align: center;">Error al cargar reportes: ${error.message}</td></tr>`;
        }
    }

    // --- Event Listeners ---
    if (btnBuscarReporte) {
        btnBuscarReporte.addEventListener('click', () => {
            const pqr = pqrBuscadorInput.value;
            cargarYMostrarReportes(pqr);
        });
    }

    if (btnCargarTodosLosReportes) {
        btnCargarTodosLosReportes.addEventListener('click', () => {
            pqrBuscadorInput.value = ''; // Limpiar el input al cargar todos
            cargarYMostrarReportes();
        });
    }

    // Cargar todos los reportes al inicio, cuando la página se carga
    cargarYMostrarReportes();
});