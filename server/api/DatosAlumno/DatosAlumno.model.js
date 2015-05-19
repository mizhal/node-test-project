'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DatosAlumnoSchema = new Schema({
  nombre: String,
  nick: String,
  codigo_uo: String,
  clave: String,
  ultimo_acceso: Date,
  estado: {
  	type: String,
  	enum: ["CREADO", "ACTIVO", "BANEADO", "INACTIVO"]
  }
});

module.exports = mongoose.model('DatosAlumno', DatosAlumnoSchema);