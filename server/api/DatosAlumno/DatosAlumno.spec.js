'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');


describe('GET /api/gestion/datos_alumnos', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/gestion/datos_alumnos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe("upload files", function(){
  before(function(done){
    var DatosAlumno = require('./DatosAlumno.model');
    var instance = new DatosAlumno();
    instance.resetAttachmentsArchive(function(){done();});
  });

  it("should be capable to upload files", function(done){
    request(app)
      .post("/api/gestion/datos_alumnos")
      .set("Content-Type", "multipart/form-data")
      .field("nombre", "Alumno de prueba")
      .field("nick", "prueba001")
      .field("codigo_uo", "uo12312")
      .field("clave", "xxxxxx")
      .field("ultimo_acceso", "1")
      .field("estado", "CREADO")
      .attach("foto", "server/api/DatosAlumno/test/fixtures/avatar.jpg")
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        done();
      });
  });

  it("should be capable to delete uploaded files when owner Alumno is destroyed", function(done){

    var created_alumno = null;

    request(app)
      .post("/api/gestion/datos_alumnos")
      .set("Content-Type", "multipart/form-data")
      .field("nombre", "Alumno de prueba")
      .field("nick", "prueba001")
      .field("codigo_uo", "uo12312")
      .field("clave", "xxxxxx")
      .field("ultimo_acceso", "1")
      .field("estado", "CREADO")
      .attach("foto", "server/api/DatosAlumno/test/fixtures/avatar.jpg")
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        created_alumno = res.body["_id"];

        request(app)
          .delete("/api/gestion/datos_alumnos/" + created_alumno)
          .expect(204)
          .end(function(){
            done();
          });

      });


  });

});