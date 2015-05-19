'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BaneoAlumnoSchema = new Schema({
  motivo: String,
  id_alumno: String,
  fecha_inicio: Date,
  fecha_fin: Date,
  permanente: Boolean,
  active: Boolean
});

module.exports = mongoose.model('BaneoAlumno', BaneoAlumnoSchema);