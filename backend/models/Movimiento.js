const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    pqr: { type: String, required: true }, // QUITAMOS unique: true para mayor flexibilidad
    quienSeLoLleva: { type: String, required: true }, // Nombre de la persona o departamento

    // NUEVO CAMPO: Referencia al ID del Material
    material: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material', // Referencia al modelo 'Material'
        required: true // Es crucial que cada movimiento esté asociado a un material
    },
    // El nombre del material lo podemos obtener desde la referencia o mantenerlo para facilidad
    nombreMaterial: { type: String }, // Hacemos que 'nombreMaterial' sea opcional si ya tenemos 'material'
    
    cantidad: { type: Number, required: true },
    unidad: { type: String }, // Opcional: unidades de medida (metros, litros, piezas)
    observacion: { type: String }, // Cualquier nota adicional
    firma: { type: String }, // Podría ser una URL a una imagen de firma o un texto de consentimiento
    
    // ELIMINAMOS EL CAMPO 'hora' SEPARADO
    fechaMovimiento: { type: Date, default: Date.now }, // ESTE CAMPO ALMACENA FECHA Y HORA COMPLETAS

    tipo: { type: String, enum: ['entrada', 'salida'], required: true } // NUEVO CAMPO: Para diferenciar entradas y salidas
}, { timestamps: true }); // Mongoose añade campos createdAt y updatedAt automáticamente

module.exports = mongoose.model('Movimiento', movimientoSchema);