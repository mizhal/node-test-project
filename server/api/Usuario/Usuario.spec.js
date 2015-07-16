'use strict';

var UsuarioFacade = require("./Usuario.model.js");
var Usuario = UsuarioFacade.Usuario;
var Role = UsuarioFacade.Role;
var Promise = require("bluebird");
var join = Promise.join;

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var assert = require('chai').assert;
var expect = require('chai').expect;

var sequelize_error = require('sequelize/lib/errors.js');

/** CONSTANTES **/

var FIXTURES = require("./Usuario.fixtures.js");

/** FIN: CONSTANTES **/

/*** AUXILIARES **/

function login_as_admin(request){
  return new Promise(function(resolve, reject){

    var credentials = {token: null}

    request(app)
      .post("/auth/local")
      .send(FIXTURES["admin-credentials"])
      .expect(200)
      .end(function(err, res){
        if(err){
          console.log("authentication error");
          reject(err);
        }
        credentials.token = res.body.token;
        resolve(credentials);
      });
  })
}


/*** FIN: AUXILIARES **/

describe('GET /api/auth', function() {

  before(function(){
    Usuario.findAll({where: {id: {gt: 1}}}).map(function(usuario){
      usuario.destroy();
    });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/auth')
      .expect(401)
      .expect('Content-Type', "text/html; charset=utf-8")
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should make crud', function(done){

    Usuario.create(FIXTURES["test-1"])
      .then(function(usuario){
        usuario.puede_entrar = false;
        return usuario.save();
      })
      .then(function(){
        return Usuario.findOne({
          where: {
            login: FIXTURES["test-1"].login
          }
        });
      })
      .then(function(usuario){
        usuario.puede_entrar.should.be.equal(false);
        return usuario;
      })
      .then(function(usuario){
        return usuario.destroy();
      })
      .then(function(){
        done();
      })
      .catch(function(error){
        done(error);
      });
  });

  it('should authenticate', function(done){

    login_as_admin(request)
      .then(function(credentials){
        expect(credentials.token).to.not.equal(null);
        done();
      })
      .catch(function(error){
        assert(false, "Authentication failed");
        console.error("Authentication failed");
        done(error);
      });

  });

  it("should autenticate (direct)", function(done){
    var admin = Usuario.build(FIXTURES["admin-2"]);
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

  it('should save password encrypted in database', function(done){

    login_as_admin(request).then(function(credentials){

      request(app)
        .post("/api/auth/usuarios")
        .set("Authorization", "Bearer " + credentials.token)
        .send(FIXTURES["test-2"])
        .expect(201)
        .end(function(err, res){
          if (err) {
            console.log(err);
            return done(err);
          } else {
            res.body.should.be.instanceof(Object);
            done();
          }
        });

    }).catch(function(error){
      done(error);
    });
  });

  it("Role: CRUD", function(done){

    Role.create(FIXTURES["test-role-2"])
      .then(function(role){
        role.nombre = "role-nombre-cambiado";
        role.slug = null;
        return role.save();
      }).then(function(role){
        role.nombre.should.be.eql("role-nombre-cambiado");
        role.slug.should.be.eql("role-nombre-cambiado");
        return role;
      }).then(function(role){
        return role.destroy();
      }).then(function(){
        done();
      }).catch(function(error){
        done(error);
      });

  });

  it("can eager load roles", function(done){
    Usuario.findOne({
      where: {login: 'admin'},
      include: {model: Role, as: "roles_full"}
    }).then(function(admin){
      admin["roles_full"].should.be.instanceof(Array);
      admin["roles_full"].length.should.be.equal(4);
      return done();
    }).catch(function(err){
      return done(err);
    });
  });

  it("can find with roles", function(done){
      Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        admin.roles.should.be.instanceof(Array);
        var roles = admin.roles;
        expect(roles.sort()).to.eql(["admin", "usuario", "profesor", "alumno"].sort());
        done();
      });
  });

  it("can assign roles", function(done){

    Role.find({
      where: {
        slug: FIXTURES["test-role-1"].slug
      }
    }).then(function(role){
      if(role)
        return role.destroy();
      else
        return;
    }).then(function(){
      return Role.create(FIXTURES["test-role-1"]);
    }).then(function(rol){
      return Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        return admin.anyadirRole(FIXTURES["test-role-1"].slug);
      });

    }).then(function(){
      return Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        expect(admin.roles).to.include(FIXTURES["test-role-1"].slug);

        // borrar el rol de prueba para que no afecte 
        // a la cuenta de roles por defecto.
        return Role.find({
          where: {
            slug: FIXTURES["test-role-1"].slug
          }
        }).then(function(role){
          return role.destroy();
        }).then(function(){
          done();
        });

      });

    });

  });

});

describe('GET /api/usuarios/roles', function() {

  xit('should respond with JSON array', function(done) {
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

  it("assign roles to user", function(done){

    Usuario.create(FIXTURES["have-roles"])
      .then(function(usuario){
        return usuario.anyadirRole("profesor")
          .then(function(){
            return usuario;
          });
      }).then(function(usuario){
        return usuario.reload();
      }).then(function(usuario){
        usuario.roles.length.should.be.equal(1);
        return usuario.destroy();
      }).then(function(){
        done();
      }).catch(function(error){
        done(error);
      });

  });

  var RoleTesting = {
    // "clase" auxiliar para crear dependencias para el test

    createUsers: function(){
      // () -> (Usuario x Usuario x Usuario)
      return join(
        Usuario.create(FIXTURES["usuario-1"]),
        Usuario.create(FIXTURES["usuario-2"]),
        Usuario.create(FIXTURES["usuario-3"])
      ).spread(function(usuario1, usuario2, usuario3){
        // les asignamos roles
        usuario1.anyadirRole("profesor");
        usuario2.anyadirRole("alumno");
        usuario3.anyadirRole("profesor");

        return join(usuario1, usuario2, usuario3);
      });
    },
    destroyUsers: function(){
      return join(
        Usuario.destroy({where:{slug: FIXTURES["usuario-1"].slug } }),
        Usuario.destroy({where:{slug: FIXTURES["usuario-2"].slug } }),
        Usuario.destroy({where:{slug: FIXTURES["usuario-3"].slug } })
      );
    }
  }

  it("can delete roles whitout affecting users", function(done){

    Role.create(FIXTURES["test-role-2"])
      .then(function(role){
        
        return RoleTesting.createUsers()
          .spread(function(usuario1, usuario2, usuario3){

            return join(
              // anyadir el Rol creado a los usuarios
              usuario1.anyadirRole(role.slug),
              usuario2.anyadirRole(role.slug),
              usuario3.anyadirRole(role.slug)
            ).then(function(){
              // verificamos que tenemos los tres usuarios asignados al rol
              return role.getUsuarios().then(function(usuarios){
                usuarios.length.should.equal(3);
              });

            }).then(function(){
              return join(
                usuario1.reload(),
                usuario2.reload(),
                usuario3.reload()
              );
            }).then(function(){
              usuario1.roles.should.eql(["test-role-2", "profesor"].sort());
              usuario2.roles.should.eql(["test-role-2", "alumno"].sort());
              usuario3.roles.should.eql(["test-role-2", "profesor"].sort());             
            }).then(function(){
              // destruimos el rol
              return role.destroy();
            }).then(function(){
              // probamos que existen los usuarios
              return join(
                  Usuario.count({where: {slug: usuario1.slug}}),
                  Usuario.count({where: {slug: usuario2.slug}}),
                  Usuario.count({where: {slug: usuario3.slug}})
                ).spread(function(count1, count2, count3){
                  count1.should.be.equal(1);
                  count2.should.be.equal(1);
                  count3.should.be.equal(1);
                });
            }).then(function(){
              // verificar los roles que tienen asignados los usuarios
              return join( // actualizamos
                  usuario1.reload(),
                  usuario2.reload(),
                  usuario3.reload()
                ).spread(function(usuario1, usuario2, usuario3){
                  // verificamos que tengan solo los roles originales asignados al crear
                  usuario1.roles.should.be.eql(["profesor"]);
                  usuario2.roles.should.be.eql(["alumno"]);
                  usuario3.roles.should.be.eql(["profesor"]);

                  return join(usuario1, usuario2, usuario3);
                });
            });

          }).then(function(){
            return RoleTesting.destroyUsers();
          });

      }).then(function(role){
        //return role.destroy();
      }).then(function(){
        done();
      }).catch(function(error){
        done(error);
      });

  });
  
});