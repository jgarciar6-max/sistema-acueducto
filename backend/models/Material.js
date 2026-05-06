const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    unidad: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Material', MaterialSchema);