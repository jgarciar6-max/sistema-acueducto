// backend/controllers/authController.js

const User = require('../models/User'); // Importamos el modelo de Usuario
const jwt = require('jsonwebtoken'); // Importamos jsonwebtoken
const bcrypt = require('bcryptjs'); // Aunque bcryptjs ya lo usamos en el modelo, lo importamos si necesitamos usarlo directamente aquí

// Función para generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe por email o username
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ message: 'El usuario o email ya existe' });
        }

        // Crear un nuevo usuario (la contraseña se hashea automáticamente por el pre('save') en el modelo)
        user = await User.create({
            username,
            email,
            password,
        });

        // Si el usuario se creó correctamente, respondemos con los datos del usuario y un token
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id), // Generamos un token para el nuevo usuario
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Autenticar un usuario y obtener un token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por su email
        const user = await User.findOne({ email });

        // Si el usuario no existe o la contraseña no coincide
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Credenciales inválidas (email o contraseña incorrectos)' });
        }

        // Si las credenciales son válidas, respondemos con los datos del usuario y un token
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id), // Generamos un token
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};