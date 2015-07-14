'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Promise = require("bluebird");
var join = Promise.join;

var Cursos = require("./cursos.model.js");
var Curso = Cursos.Curso;

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

  it("should make crud and generate slug", function(done){
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
});