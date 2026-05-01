const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('💧 Base de Datos del Acueducto Conectada');
    } catch (error) {
        console.error('Error al conectar:', error.message);
        process.exit(1); // Detiene la app si no hay conexión
    }
};

module.exports = conectarDB;