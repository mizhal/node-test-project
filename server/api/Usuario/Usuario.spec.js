'use strict';

var Usuario = require("./Usuario.model.js");

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/usuarios', function() {

  before(function(){
    Usuario.findAll().map(function(usuario){
      usuario.destroy();
    });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/usuarios')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should make crud', function(done){
    var body = {
      login: "test1",
      password: "the-password",
      ultimo_acceso: 1,
      puede_entrar: true
    }
    var new_ = Usuario.build(body);
    new_.save()
      .then(function(Usuario) {
        done(null)
      }).catch(function(error){
        done(error);
      });
  })

  it('should save password encrypted in database', function(done){
    var data = {
      login: "test2",
      password: "the-password",
      ultimo_acceso: 1,
      puede_entrar: true
    };

    request(app)
      .post("/api/usuarios")
      .send(data)
      .expect(201)
      .end(function(err, res){
        if (err) {
          console.log(err);
          return done(err);
        }
        data.should.be.instanceof(Object);
        res.body.should.be.instanceof(Object);
        done();
      })
  });

  it("should autenticate", function(done){
    var admin = Usuario.build({
      login: "admin", 
      password: "admin"
    });
    admin.save()
      .then(function(admin){
        should(admin.autenticar("admin")).equal(true);
        should(admin.autenticar("xxxx")).equal(false);
        done();
      }).catch(function(error){
        console.log("Error al crear usuario admin");
        done(error);
      });
  });

});