const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/', materialController.obtenerMateriales);
router.post('/', materialController.crearMaterial);

module.exports = router;