const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Obtener el token de la cabecera Authorization
    // El token generalmente viene en el formato "Bearer TOKEN_LARGO"
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    const token = authHeader.split(' ')[1]; // Separar "Bearer" del TOKEN_LARGO

    if (!token) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    try {
        // 2. Verificar el token
        // Usamos process.env.JWT_SECRET que definiste en tu .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Añadir la información del usuario al objeto req
        // Esto permite que tus rutas o controladores sepan qué usuario hizo la petición
        // decoded.user contendrá el id del usuario que pusimos al crear el token
        req.user = decoded.user;
        next(); // Pasar al siguiente middleware/controlador
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;