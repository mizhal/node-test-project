'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Promise = require("bluebird");
var join = Promise.join;

var Cursos = require("./cursos.model.js");
var Curso = Cursos.Curso;
var DatosAlumno = Cursos.DatosAlumno;

describe('GET /api/cursos', function() {

  xit('should respond with JSON array', function(done) {
    request(app)
      .get('/api/cursos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it("Cursos: should make crud and generate slug", function(done){
    var NOMBRE_CURSO = "Curso 2015/2016";
    join(
      // destruir los cursos creados por tests previos
      // el join es necesario porque el map lleva promesas
      Curso.findAll({
        where: {nombre: NOMBRE_CURSO}
      }).map(function(curso){
        return curso.destroy();
      })
      
    ).then(function(){

      // crear y probar
      Curso.create({
        nombre: NOMBRE_CURSO,
        anyo: 2015
      }).then(function(){
        // ver que esta guardado
        return Curso.findAll({
          where: {
            nombre: NOMBRE_CURSO
          }
        }).then(function(cursos){
          // probar la generacion del slug
          cursos.length.should.be.equal(1);
          cursos[0].slug.should.be.eql("Curso-20152016-2015");
          return cursos;
        }).then(function(cursos){
          // probar actualizacion
          var curso = cursos[0];
          curso.nombre = "Otro nombre";
          return curso.save();
        }).then(function(curso){
          // probar actualizacion del slug
          curso.slug.should.be.eql("Otro-nombre-2015");
          return curso;
        }).then(function(curso){
          // probar destroy
          return curso.destroy();
        }).then(function(){
          done();
        });

      });

    });

  });

  /*** DATOSALUMNO **/
  var Auth = require("../Usuario/Usuario.model.js");
  var Usuario = Auth.Usuario;

  function prerequisitos_datosalumno_crud(){
    /*** Genera los objetos que necesitamos para crear 
    entidades DatosAlumno
    ***/
    var Usuario_data = {
        login: "alumno1",
        password: "the-password",
        ultimo_acceso: 1,
        puede_entrar: true
      };
    var Curso_data = {
        nombre: "Curso de prueba",
        anyo: 2015
      };

    return destroy_prerrequisitos_datosalumno()
      .then(function(){
        return join(
          Usuario.create(Usuario_data),
          Curso.create(Curso_data)
        )
      });
  };

  function destroy_prerrequisitos_datosalumno(){
    return join(
      Usuario.findAll({
          where: {
            login: "alumno1"
          }
        }).map(function(usuario){
          return usuario.destroy();
        }),
      Curso.findAll({
          where: {
            nombre: "Curso de prueba"
          }
        }).map(function(curso){
          return curso.destroy();
        })
    )
  };
  
  it("DatosAlumno: crud", function(done){

    prerequisitos_datosalumno_crud()
    .spread(function(usuario, curso){
      var CODIGO_UO = "uo12312";

      return DatosAlumno.create({
        nombre_completo: "Pedro Pérez Mateos",
        usuarioId: usuario.id,
        codigo_uo: CODIGO_UO,
        foto: "TEST!",
        cursoId: curso.id,
      }).then(function(datos_alumno){
        datos_alumno.nombre_completo = "Alfredo Rodriguez Vallejo";
        return datos_alumno.save();
      }).then(function(){
        return DatosAlumno.findOne({
          where: {codigo_uo: CODIGO_UO}
        });
      }).then(function(datos_alumno){
        datos_alumno.nombre_completo.should.be.eql("Alfredo Rodriguez Vallejo");
        return datos_alumno;
      }).then(function(datos_alumno){
        return datos_alumno.destroy();
      });

    }).then(function(){
      return destroy_prerrequisitos_datosalumno();
    }).then(function(){
      done();
    });
    
  });

});