// ==============================================
//       SERVIDOR PRINCIPAL - SISTEMA ACUEDUCTO
// ==============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const conectarDB = require('./config/db'); // Asegúrate que esta ruta a db.js es correcta

// CONECTAR A MONGODB
conectarDB();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// RUTA DE PRUEBA DEL SERVIDOR BASE
app.get('/', (req, res) => {
    res.send('🚀 Servidor del Sistema Acueducto funcionando correctamente.');
});

// ==============================================================
// RUTA DIRECTA DE PRUEBA PARA MATERIALES (TEMPORALMENTE ACTIVA)
// ¡ESTA LÍNEA DEBE ESTAR DESCOMENTADA PARA LA PRUEBA!
// ==============================================================
app.get('/api/materiales', (req, res) => {
    res.json({ mensaje: '¡Hola desde la ruta directa de materiales!' });
});


// ==============================================================
// RUTA REAL DE MATERIALES (COMENTADA PARA ESTA PRUEBA)
// DEBES DESCOMENTAR LA SIGUIENTE LÍNEA CUANDO LA PRUEBA DIRECTA FUNCIONE
// Y QUITAR LA RUTA DIRECTA DE ARRIBA.
// ==============================================================
// app.use('/api/materiales', require('./routes/materialRoutes'));


// ENCENDER SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto: ${PORT}`);
});