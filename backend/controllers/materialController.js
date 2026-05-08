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

// NUEVA FUNCIÓN: BUSCAR MATERIALES POR NOMBRE
exports.buscarMaterialesPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query; // Obtenemos el parámetro 'nombre' de la URL (ej: /api/materiales/buscar?nombre=tubo)

        if (!nombre) {
            return res.status(400).json({ mensaje: 'El parámetro "nombre" es requerido para la búsqueda.' });
        }

        // Usamos una expresión regular para buscar coincidencias parciales e ignorar mayúsculas/minúsculas
        const materialesEncontrados = await Material.find({
            nombre: { $regex: nombre, $options: 'i' } // $regex permite búsqueda parcial, $options: 'i' ignora case
        });

        res.json(materialesEncontrados);
    } catch (error) {
        console.error('Error al buscar materiales por nombre:', error);
        res.status(500).json({ mensaje: 'Error del servidor al buscar materiales por nombre', error });
    }
};