// backend/routes/authRoutes.js

const express = require('express');
// Importamos las funciones del controlador de autenticación
const { registerUser, loginUser } = require('../controllers/authController');

// Creamos un nuevo objeto Router de Express
const router = express.Router();

// Definimos la ruta para registrar un nuevo usuario
// Cuando alguien haga una petición POST a /api/auth/register, se ejecutará la función registerUser
router.post('/register', registerUser);

// Definimos la ruta para iniciar sesión
// Cuando alguien haga una petición POST a /api/auth/login, se ejecutará la función loginUser
router.post('/login', loginUser);

// Exportamos el router para poder usarlo en index.js
module.exports = router;