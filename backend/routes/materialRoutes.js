const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// NUEVA RUTA: Para buscar materiales por nombre
// Es importante que vaya ANTES de router.get('/')
router.get('/buscar', materialController.buscarMaterialesPorNombre); 

// Ruta para obtener todos los materiales
router.get('/', materialController.obtenerMateriales);

// Ruta para crear un nuevo material
router.post('/', materialController.crearMaterial);

module.exports = router;