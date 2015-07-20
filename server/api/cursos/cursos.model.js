'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var slugger = require('../../components/slugger');

// dependencias de otros paquetes
var Auth = require("../Usuario/Usuario.model.js");

/** MODELO CURSO **/
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
      unique: "nombre_anyo",
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
      unique: "nombre_anyo",
      defaultValue: (new Date()).getFullYear()
    }
  },
  {//CONFIGURACION
    timestamps: true,
    tableName: "Cursos"
  }
);

// Hook para generar el SLUG
Curso.hook("beforeValidate", function(curso){
  return slugger.generator(
    curso, 
    Curso, 
    curso.nombre + "-" + curso.anyo,
    "slug",
    CURSO_SLUG_FIELD_SIZE
  );
});
/** FIN: MODELO CURSO **/

/** MODELO DATOSALUMNO **/
var DATOS_ALUMNO_SLUG_FIELD_SIZE = 128;
var DatosAlumno = sequelize.define('DatosAlumno', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_completo: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING(DATOS_ALUMNO_SLUG_FIELD_SIZE),
      allowNull: false,
      unique: true
    },
    usuarioId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    codigo_uo: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    foto: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    cursoId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },{
    timestamps: true,
    tableName: "DatosAlumnos"
  });

// Hook para generar el SLUG
DatosAlumno.hook("beforeValidate", function(datos_alumno){
  return slugger.generator(
    datos_alumno,
    DatosAlumno, 
    datos_alumno.nombre_completo,
    "slug",
    DATOS_ALUMNO_SLUG_FIELD_SIZE
  );
});

// Relaciones
DatosAlumno.belongsTo(Auth.Usuario, {
  foreignKey: "usuarioId", 
  onDelete: "cascade",
  onUpdate: "cascade"
});
DatosAlumno.belongsTo(Curso, {
  foreignKey: "cursoId",
  onDelete: "cascade",
  onUpdate: "cascade"
});
/** FIN: MODELO DATOSALUMNO **/

/** MODELO DATOSPROFESOR **/
var DATOS_PROFESOR_SLUG_FIELD_SIZE = 128;
var DatosProfesor = sequelize.define('DatosProfesor', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_completo: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(128),
      allowNull: false,
      unique: true
    },   
    usuarioId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: "DatosProfesores"
  }
);

// Hook para generar el SLUG
DatosProfesor.hook("beforeValidate", function(datos_profesor){
  return slugger.generator(
    datos_profesor,
    DatosProfesor,
    datos_profesor.nombre_completo,
    "slug",
    DATOS_PROFESOR_SLUG_FIELD_SIZE
  );
});

// Relaciones
DatosProfesor.belongsTo(Auth.Usuario, {
  foreignKey: "usuarioId",
  onDelete: "cascade",
  onUpdate: "cascade"
});

// tabla intermedia NxM
var CursosDatosProfesores = sequelize.define("CursosDatosProfesores", {
}, {
  tableName: "CursosDatosProfesores"
});

// relacion DatosProfesor x Curso
Curso.belongsToMany(DatosProfesor, {
  through: CursosDatosProfesores,
  as: "profesores",
  foreignKey: "cursoId"
});
DatosProfesor.belongsToMany(Curso, {
  through: CursosDatosProfesores,
  as: "cursos",
  foreignKey: "datosProfesorId"
});
/** FIN: MODELO DATOSPROFESOR **/

/** Exterior del paquete de modelos **/
var Cursos = {
  Curso: Curso,
  DatosAlumno: DatosAlumno,
  DatosProfesor: DatosProfesor,
  CursosDatosProfesores: CursosDatosProfesores
};

module.exports = Cursos;