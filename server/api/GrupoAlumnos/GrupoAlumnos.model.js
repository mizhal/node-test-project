'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GrupoAlumnosSchema = new Schema({
  nombre: String,
  anyo: String,
  curso: Number,
  estado: {
  	type: String,
  	enum: ["ACTIVO", "OCULTO"]
  }
});

module.exports = mongoose.model('GrupoAlumnos', GrupoAlumnosSchema);