const express = require('express');
const router = express.Router();
const pqrController = require('../controllers/pqrController');

// Rutas
router.post('/crear', pqrController.crearPqr);

module.exports = router;
