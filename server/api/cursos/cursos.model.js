'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var CURSO_SLUG_FIELD_SIZE = 128;
var Curso = sequelize.define('Curso', 
  {//CAMPOS
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: Sequelize.STRING(128),
      allowNull: false,
      unique: true,
      validate: {

      }
    },
    slug: {
      type: Sequelize.STRING(CURSO_SLUG_FIELD_SIZE),
      allowNull: false,
      unique: true
    },
    anyo: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: (new Date()).getFullYear()
    }
  },
  {//CONFIGURACION
    timestamps: true,
    tablename: "Cursos"
  }
);

// Hook para generar el SLUG
var slug = require('../../components/slugger');
Curso.hook("beforeValidate", function(curso){
  return slug.generator(
    curso, 
    Curso, 
    curso.nombre + "-" + curso.anyo,
    "slug",
    CURSO_SLUG_FIELD_SIZE
  );
});

var Cursos = {
  Curso: Curso
};

module.exports = Cursos;