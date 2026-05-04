// ==============================================
//       SERVIDOR PRINCIPAL - SISTEMA ACUEDUCTO
// ==============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Importar mongoose, aunque no se usa directamente aquí si conectarDB lo maneja
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const conectarDB = require('./config/db'); // Asegúrate que esta ruta a db.js es correcta

// CONECTAR A MONGODB
conectarDB();

// MIDDLEWARES
app.use(cors());
app.use(express.json()); // Para parsear JSON en el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios URL-encoded


// RUTA DE PRUEBA DEL SERVIDOR BASE
app.get('/', (req, res) => {
    res.send('🚀 Servidor del Sistema Acueducto funcionando correctamente.');
});

// ==============================================================
// RUTA REAL DE MATERIALES (¡ESTA DEBE ESTAR ACTIVA Y USAR EL ROUTER!)
// ==============================================================
// Importa y usa el router de materiales.
// Ahora, al acceder a /api/materiales, se usará el router que definiste en materialRoutes.js
app.use('/api/materiales', require('./routes/materialRoutes'));


// ==============================================================
// ¡IMPORTANTE!: Asegúrate que NO haya otras rutas duplicadas o
// comentadas que puedan causar confusión, como la ruta directa
// de prueba que teníamos antes.
// ==============================================================


// ENCENDER SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto: ${PORT}`);
});