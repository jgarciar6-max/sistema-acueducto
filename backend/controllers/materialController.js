const Material = require('../models/Material');

// OBTENER TODOS LOS MATERIALES
exports.obtenerMateriales = async (req, res) => {
    try {
        const materiales = await Material.find();
        res.json(materiales);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener materiales', error });
    }
};

// CREAR UN NUEVO MATERIAL
exports.crearMaterial = async (req, res) => {
    try {
        const nuevoMaterial = new Material(req.body);
        await nuevoMaterial.save();
        res.status(201).json(nuevoMaterial);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear material', error });
    }
};