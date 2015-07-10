'use strict';

var UsuarioFacade = require("./Usuario.model.js");
var Usuario = UsuarioFacade.Usuario;
var Role = UsuarioFacade.Role;

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/usuarios', function() {

  before(function(){
    Usuario.findAll({where: {id: {gt: 1}}}).map(function(usuario){
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
      login: "admin-2", 
      password: "admin"
    });
    admin.save()
      .then(function(admin){
        should(admin.autenticar("admin")).equal(true);
        should(admin.autenticar("xxxx")).equal(false);
        done();
      }).catch(function(error){
        console.log("Error al crear usuario admin2");
        done(error);
      });
  });

  it("can eager load roles", function(done){
    Usuario.findOne({
      where: {login: 'admin'},
      include: {model: Role, as: "Roles"}
    })
      .then(function(admin){
        admin["Roles"].should.be.instanceof(Array);
        admin["Roles"].length.should.be.equal(4);
        return done();
      })
      .catch(function(err){
        return done(err);
      });
  });

  it("can find with roles", function(done){

    Usuario.findOneWithRoles({
      where: {id: 1}
    })
    .then(function(admin){
      should(admin.login).be.equal("admin");
      admin["Roles"].should.be.instanceof(Array);
      admin["Roles"].length.should.be.equal(4);
      admin["Roles"][0].should.be.equal("admin");
      return done();
    })
    .catch(function(err){
      return done(err);
    });

  });

});

describe('GET /api/usuarios/roles', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/roles')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it("should be unique", function(done){
    Role.create({nombre: "test-admin"})
      .then(function(){
        return Role.create({nombre: "test-admin"});    
      })
      .then(function(){
        done();
      })
      .catch(function(error){
        done(error, null);
      });

  });
});