require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');

const app = express();

// Conectar a la base de datos
conectarDB();

app.use(express.json());

app.use('/api/pqr', require('./routes/pqrRoutes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
app.use('/api/productos', require('./routes/productos')); 