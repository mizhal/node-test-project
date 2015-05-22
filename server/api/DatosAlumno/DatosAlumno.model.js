'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var model_attachments = require("../../components/model_attachments");

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

DatosAlumnoSchema.plugin(model_attachments, {field_names: ['foto'], path: "client/assets/attached_files/DatosAlumno"});

module.exports = mongoose.model('DatosAlumno', DatosAlumnoSchema);