const mongoose = require('mongoose');

const pqrSchema = new mongoose.Schema({
  numeroRadicado: String,
  nombre: String,
  descripcion: String
});

module.exports = mongoose.model('Pqr', pqrSchema);
