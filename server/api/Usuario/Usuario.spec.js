'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/usuarios', function() {

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
    var Usuario = require("./Usuario.model.js");
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
      login: "test1",
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
});