const express = require('express');
const router = express.Router();
const Movimiento = require('../models/Movimiento'); // Importa el modelo de Movimiento (ya actualizado)
const Material = require('../models/Material');   // ¡NUEVO! Importa el modelo de Material para interactuar con el inventario

// RUTA 1: Obtener TODOS los movimientos
router.get('/', async (req, res) => {
    try {
        // Al obtener movimientos, podríamos querer 'poblar' el campo 'material'
        // para que también nos traiga los detalles del material asociado si fuese necesario.
        // Por ahora, solo devuelve el ID, que es lo que tenemos en el modelo.
        const movimientos = await Movimiento.find();
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// RUTA 2: Crear un NUEVO movimiento (Registrar Entradas o Salidas)
router.post('/', async (req, res) => {
    const { pqr, quienSeLoLleva, material, nombreMaterial, cantidad, observacion, firma, fechaMovimiento, tipo } = req.body;

    // --- VALIDACIONES INICIALES ---
    if (!pqr || !quienSeLoLleva || !material || !cantidad || !fechaMovimiento || !tipo) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados: PQR, Quién se lo lleva, Material (ID), Cantidad, Fecha de Movimiento y Tipo.' });
    }
    if (isNaN(cantidad) || parseInt(cantidad) <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser un número válido mayor que cero.' });
    }
    if (!['entrada', 'salida'].includes(tipo)) {
        return res.status(400).json({ message: 'El tipo de movimiento debe ser "entrada" o "salida".' });
    }

    try {
        // 1. Verificar si el Material existe
        const materialEncontrado = await Material.findById(material);
        if (!materialEncontrado) {
            return res.status(404).json({ message: 'Material no encontrado. Por favor, selecciona un material válido.' });
        }

        let nuevaCantidadMaterial = materialEncontrado.cantidad;

        // 2. Lógica para Entradas o Salidas
        if (tipo === 'salida') {
            if (materialEncontrado.cantidad < cantidad) {
                return res.status(400).json({ message: `No hay suficiente stock de ${materialEncontrado.nombre}. Stock actual: ${materialEncontrado.cantidad}. Cantidad solicitada: ${cantidad}.` });
            }
            nuevaCantidadMaterial -= parseInt(cantidad); // Restar stock
        } else if (tipo === 'entrada') {
            // Lógica para entradas (si decides implementarla más adelante con este mismo endpoint)
            nuevaCantidadMaterial += parseInt(cantidad); // Sumar stock
        }

        // 3. Actualizar la cantidad del material en el inventario
        materialEncontrado.cantidad = nuevaCantidadMaterial;
        await materialEncontrado.save();

        // 4. Crear y guardar el nuevo movimiento
        const nuevoMovimiento = new Movimiento({
            pqr,
            quienSeLoLleva,
            material: materialEncontrado._id, // Almacena el ID del Material
            nombreMaterial: nombreMaterial || materialEncontrado.nombre, // Usa el nombre que viene del frontend o el del material
            cantidad: parseInt(cantidad),
            // unidad: materialEncontrado.unidad, // Podrías tomar la unidad directamente del material si la tuvieras
            observacion,
            firma,
            fechaMovimiento, // Ya incluye fecha y hora
            tipo
        });

        const movimientoGuardado = await nuevoMovimiento.save();
        res.status(201).json(movimientoGuardado); // Devuelve el movimiento registrado

    } catch (error) {
        console.error('Error al registrar movimiento o actualizar material:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar el movimiento.', error: error.message });
    }
});

// RUTA 3: Buscar movimientos por N° PQR
router.get('/buscar', async (req, res) => {
    const pqrABuscar = req.query.pqr;

    if (!pqrABuscar) {
        return res.status(400).json({ message: "Se requiere el parámetro 'pqr' para la búsqueda." });
    }

    try {
        // Modificado para también 'poblar' la información del material asociado
        const movimientosEncontrados = await Movimiento.find({
            pqr: { $regex: pqrABuscar, $options: 'i' }
        });
        res.json(movimientosEncontrados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;