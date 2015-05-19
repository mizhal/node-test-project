'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DatosProfesorSchema = new Schema({
  nombre: String,
  nick: String,
  clave: String,
  ultimo_acceso: Date,
  estado: {
  	type: String,
  	enum: ["CREADO", "ACTIVO", "INACTIVO"]
  }
});

module.exports = mongoose.model('DatosProfesor', DatosProfesorSchema);