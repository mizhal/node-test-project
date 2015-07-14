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

  it("should make crud", function(done){
    var NOMBRE_CURSO = "Curso 2015/2016";
    join(
      // destruir los cursos creados por tests previos
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
      }).then(function(curso){

        Curso.findAll({
          where: {
            nombre: NOMBRE_CURSO
          }
        }).then(function(found){
          found.length.should.be.equal(1);
          done();
        });

      });


    });

  });
});