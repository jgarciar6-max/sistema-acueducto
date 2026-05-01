const Pqr = require('../models/Pqr');
// Crear un nuevo PQR
exports.crearPqr = async (req, res) => {
  try {
    const nuevoPqr = new Pqr(req.body);
    await nuevoPqr.save();
    res.status(201).json({
      mensaje: 'PQR creado correctamente',
      pqr: nuevoPqr
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear el PQR',
      error: error.message
    });
  }
};