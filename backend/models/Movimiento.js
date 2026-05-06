// backend/models/Movimiento.js
const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    pqr: { type: String, required: true, unique: true }, // N° PQR o ORDEN de salida
    quienSeLoLleva: { type: String, required: true }, // Nombre de la persona o departamento
    nombreMaterial: { type: String, required: true }, // Nombre del material que se llevó
    cantidad: { type: Number, required: true },
    unidad: { type: String }, // Opcional: unidades de medida (metros, litros, piezas)
    observacion: { type: String }, // Cualquier nota adicional
    firma: { type: String }, // Podría ser una URL a una imagen de firma o un texto de consentimiento
    hora: { type: String, required: true }, // O si usas Date, puedes formatearla en el frontend
    fechaMovimiento: { type: Date, default: Date.now } // Fecha de la salida del material
}, { timestamps: true }); // Mongoose añade campos createdAt y updatedAt automáticamente

module.exports = mongoose.model('Movimiento', movimientoSchema);