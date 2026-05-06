// backend/routes/movimientoRoutes.js
const express = require('express');
const router = express.Router();
const Movimiento = require('../models/Movimiento'); // Importa el modelo que acabas de crear

// RUTA 1: Obtener TODOS los movimientos
router.get('/', async (req, res) => {
    try {
        const movimientos = await Movimiento.find();
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// RUTA 2: Crear un NUEVO movimiento (para registrar una salida)
router.post('/', async (req, res) => {
    const movimiento = new Movimiento({
        pqr: req.body.pqr,
        quienSeLoLleva: req.body.quienSeLoLleva,
        nombreMaterial: req.body.nombreMaterial,
        cantidad: req.body.cantidad,
        unidad: req.body.unidad,
        observacion: req.body.observacion,
        firma: req.body.firma,
        hora: req.body.hora,
        fechaMovimiento: req.body.fechaMovimiento
    });
    try {
        const nuevoMovimiento = await movimiento.save();
        res.status(201).json(nuevoMovimiento);
    } catch (error) {
        // Manejo de errores, por ejemplo, si el PQR ya existe (unique: true)
        res.status(400).json({ message: error.message });
    }
});

// RUTA 3 (¡LA IMPORTANTE PARA LA BÚSQUEDA!): Buscar movimientos por N° PQR
router.get('/buscar', async (req, res) => {
    const pqrABuscar = req.query.pqr; // Obtiene el valor de 'pqr' de la URL (ej. /buscar?pqr=PQR-001)

    // Si no se proporciona un PQR, devolvemos un error 400 Bad Request
    if (!pqrABuscar) {
        return res.status(400).json({ message: "Se requiere el parámetro 'pqr' para la búsqueda." });
    }

    try {
        // Utilizamos $regex para buscar coincidencias parciales y $options: 'i' para ignorar mayúsculas/minúsculas
        const movimientosEncontrados = await Movimiento.find({
            pqr: { $regex: pqrABuscar, $options: 'i' }
        });
        res.json(movimientosEncontrados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;