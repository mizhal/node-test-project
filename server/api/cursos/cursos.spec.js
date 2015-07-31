'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Promise = require("bluebird");
var join = Promise.join;
var sequelize_fixtures = require('sequelize-fixtures');

// Modelos y paquetes necesarios
var Auth = require("../Usuario/Usuario.model.js");
var Usuario = Auth.Usuario;
var Cursos = require("./cursos.model.js");
var Curso = Cursos.Curso;
var DatosAlumno = Cursos.DatosAlumno;
var DatosProfesor = Cursos.DatosProfesor;
var CursosDatosProfesores = Cursos.CursosDatosProfesores;
// FIN: Modelos y paquetes necesarios

// Carga de fixtures
sequelize_fixtures.loadFile("fixtures/cursos.fixtures.yml", Cursos);
// FIN: Carga de fixtures

describe('GET /api/cursos', function(done) {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/cursos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.equal(7);
        done();
      });
  });

  it("paginates", function(done){
    request(app)
      .get('/api/cursos')
      .expect(200)
      .set("Range-Unit", "items")
      .set("Range", "3-4")
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.equal(2);
        // pedimos el tercer y cuarto elemento
        res.body.map(function(curso){
          return curso.slug;
        })
        .sort()
        .should.be.eql(
          ["3-grupo-c-2015", "1-grupo-a-2011"].sort()
        );

        done();
      });
  });

  it("Cursos: should make crud and generate slug", function(done){
    var NOMBRE_CURSO = "Curso 2015/2016";

    // destruir los cursos creados por tests previos
    // el join es necesario porque el map lleva promesas
    Curso.destroy({
      where: {nombre: NOMBRE_CURSO}
    }).then(function(){

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
          curso.slug = null // para forzar a que regenere 
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

  var DependenciasDatosAlumno = {
    create: function () {
      /*** Genera los objetos que necesitamos para crear 
      entidades DatosAlumno
      ***/
      this.usuario_data = {
        login: "alumno1",
        password: "the-password",
        ultimo_acceso: 1,
        puede_entrar: true
      };
      this.curso_data = {
        nombre: "Curso de prueba",
        anyo: 2015
      };

      var host = this;
      return this.destroy()
        .then(function(){
          return join(
            Usuario.create(host.usuario_data),
            Curso.create(host.curso_data)
          )
        });
    },
    destroy: function(){
      return join(
        Usuario.destroy({
          where: {
            login: this.usuario_data.login
          }
        }),
        Curso.destroy({
          where: {
            nombre: this.curso_data.nombre
          }
        })
      )
    }
  };
  
  it("DatosAlumno: crud", function(done){

    DependenciasDatosAlumno.create()
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
        DependenciasDatosAlumno.destroy();
        done();
      });
  });

  /*** FIN: DATOSALUMNO **/

  /*** DATOSPROFESOR **/

  var DependenciasDatosProfesor = {
    create: function () {
      this.datos_usuario = {
          login: "profesor1",
          password: "the-password",
          ultimo_acceso: 1,
          puede_entrar: true
      };
      this.datos_curso1 = {
          nombre: "Curso de prueba",
          anyo: 2015,
          slug: "prueba-1"
      };
      this.datos_curso2 = {
          nombre: "Curso de prueba 2",
          anyo: 2015,
          slug: "prueba-2"
      };

      var host = this;
      return this.destroy()
        .then(function(){
          return join(
            Usuario.create(host.datos_usuario),
            Curso.create(host.datos_curso1),
            Curso.create(host.datos_curso2)
          );
        }).spread(function(usuario, curso1, curso2){

          return usuario.anyadirRole("profesor")
            .then(function(){
              return join(
                usuario, 
                curso1,
                curso2
              );
            });

        });
    },

    destroy: function(){

      return join(
        Usuario.destroy({
          where: {
            login: this.datos_usuario.login
          }
        }),
        Curso.destroy({
          where: {
            slug: this.datos_curso1.slug
          }
        }),
        Curso.destroy({
          where: {
            slug: this.datos_curso2.slug
          }
        })
      );
    }
  };

  it("DatosProfesor: CRUD", function(done) {

    DependenciasDatosProfesor.create()
      .spread(function(usuario, curso1, curso2){

        return DatosProfesor.create({
          nombre_completo: "Lucia Marquez Brenes",
          usuarioId: usuario.id
        }).then(function(datos_profesor){
          return datos_profesor.setCursos([curso1, curso2])
            .then(function(){
              return datos_profesor;
            });
        }).then(function(datos_profesor){
          return datos_profesor.destroy();
        });

      }).then(function(){
        return DependenciasDatosProfesor.destroy();
      }).then(function(){
        done();
      }).catch(function(error){
        done(error);
      });
  }) 

  it("DatosProfesor: Can bind to many courses", function(done){
    DependenciasDatosProfesor.create()
      .spread(function(usuario, curso1, curso2){

        return DatosProfesor.create({

          nombre_completo: "Lucia Marquez Brenes",
          usuarioId: usuario.id

        }).then(function(datos_profesor){

          return datos_profesor.setCursos([curso2])
            .then(function(){
              return datos_profesor.reload();
            });

        }).then(function(datos_profesor){

          return datos_profesor.getCursos()
            .then(function(cursos){
              cursos.length.should.be.equal(1);
              return datos_profesor;
            });

        }).then(function(datos_profesor){

          return datos_profesor.addCurso(curso1)
            .then(function(){
              return datos_profesor.reload();
            });

        }).then(function(datos_profesor){

          return datos_profesor.getCursos()
            .then(function(cursos){
              cursos.length.should.be.equal(2);
              cursos.map(function(curso){
                return curso.slug;
              }).sort().should.be.eql(
                ["prueba-2", "prueba-1"].sort()
              );
              return datos_profesor;
            });

        }).then(function(datos_profesor){

          return datos_profesor.setCursos([curso1])
            .then(function(){
              return datos_profesor.reload();
            });

        }).then(function(datos_profesor){

          return datos_profesor.getCursos()
            .then(function(cursos){
              cursos.length.should.be.equal(1);
              return datos_profesor;
            });

        }).then(function(datos_profesor){

          return datos_profesor.destroy();

        }).then(function(){
          // liberar las dependencias
          return DependenciasDatosProfesor.destroy();

        }).then(function(){
          // comprobar que no quedan elementos de la tabla
          // del join despues de destruir el objeto
          return CursosDatosProfesores.count()
            .then(function(count){
              count.should.be.equal(0);
            });

        }).then(function(){

          done();

        }).catch(function(error){

          done(error);

        });

      });
  })

  /*** FIN: DATOSPROFESOR **/

});