// ==============================================
//       SERVIDOR PRINCIPAL - SISTEMA ACUEDUCTO
// ==============================================

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express'); // Importa Express
const mongoose = require('mongoose'); // Importa Mongoose para MongoDB
const cors = require('cors'); // Importa CORS para permitir peticiones de diferentes orígenes

// Importa los archivos de rutas de tu aplicación
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes'); // Asegúrate de tener este archivo
const movimientoRoutes = require('./routes/movimientoRoutes'); // Asegúrate de tener este archivo

// Importa la función para conectar a la base de datos
const conectarDB = require('./config/db'); // Asegúrate que esta ruta a db.js es correcta


// Inicializa la aplicación Express
const app = express();
// Define el puerto, usando la variable de entorno PORT o 3000 por defecto
const PORT = process.env.PORT || 3000;


// ==============================================
// CONEXIÓN A LA BASE DE DATOS
// ==============================================
conectarDB(); // Llama a la función para conectar a MongoDB


// ==============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ==============================================

// Middleware para CORS: Permite que tu frontend (ej. Live Server) se comunique con este backend.
app.use(cors({
    origin: [
        'http://localhost:5500',           // Permite peticiones desde Live Server en tu PC (localhost)
        'http://127.0.0.1:5500',           // Permite peticiones desde Live Server en tu PC (IP local)
        // Si vas a probar desde tu teléfono o desde otra IP en tu red local, descomenta y reemplaza:
        // 'http://TU_IP_LOCAL:5500' // Ej: 'http://192.168.1.100:5500' (si tu PC tiene esa IP local y Live Server corre en 5500)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define qué métodos HTTP se permiten para las peticiones CORS
    credentials: true // Importante si tu aplicación maneja cookies, cabeceras de autorización, etc.
}));

// Middleware para parsear cuerpos de petición con formato JSON (muy importante para APIs)
app.use(express.json());
// Middleware para parsear cuerpos de petición con formato URL-encoded (para formularios HTML)
app.use(express.urlencoded({ extended: true }));


// ==============================================
// RUTAS DE LA APLICACIÓN
// ==============================================

// RUTA DE PRUEBA DEL SERVIDOR BASE: Responde a la raíz del servidor (ej. http://localhost:3000/)
app.get('/', (req, res) => {
    res.send('🚀 Servidor del Sistema Acueducto funcionando correctamente.');
});

// Middleware para las rutas de autenticación
app.use('/api/auth', authRoutes);
// Middleware para las rutas de materiales
app.use('/api/materiales', materialRoutes); // Se usa materialRoutes directamente (ya importado)
// Middleware para las rutas de movimientos
app.use('/api/movimientos', movimientoRoutes); // Se usa movimientoRoutes directamente (ya importado)


// ==============================================
// ENCENDER SERVIDOR
// ==============================================
// Inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto: ${PORT}`);
});