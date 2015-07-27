/** Tests de ArchiveManager **/

'use strict';

/** deps de pruebas **/
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var expect = require('chai').expect;
/** FIN: deps de pruebas **/

/** deps de modulos externos **/
var Promise = require('bluebird');
var path = require('path');
var fs = require("fs");
/** FIN: deps de modulos externos **/

/** configuracion general **/
var config /*:IPFCConfig */ = require("../../config/environment");

/** Inicializacion de los logs **/
var logger_module /*:ILoggerModule*/ = require("../logger");
logger_module.setConfig(config);
var logger /* ILogger */ = logger_module.getLogger();
/** FIN: Inicializacion de los logs **/

/** deps de modulos internos del proyecto **/
var ArchiveManager = require("./archive-manager");
var FileModel = require("./file_model.model");
var HostModel = require("./host_model.model");
var model_name = "Model";
var attachModule /* :IModelAttachments */ = require("./index");
/** FIN: deps de modulos internos del proyecto **/

/** configuracion de archivos adjuntos **/
attachModule.setSettings({base_path: "/test-archive"});

/** FIN: configuracion de archivos adjuntos **/

describe("ArchiveManager", function() {

  it("Can set and override global settings", function(){

    attachModule.setSettings({base_path: "/test-archive"});
    expect(attachModule.settings.base_path).to.eql("/test-archive");
    
  })

  it("Should create folders", function(done){

    var base_path = attachModule.settings.base_path;

    var archive = new ArchiveManager(base_path, model_name);

    var expected_dirs = [
      path.join(process.env.PWD, base_path),
      path.join(process.env.PWD, base_path, model_name),
      path.join(process.env.PWD, base_path, model_name, "photo"),
      path.join(process.env.PWD, base_path, model_name, "icon")
    ]; 

    archive.create()
      .then(function(){
        // anyadimos los campos
        return archive.addField("photo");
      })
      .then(function(){
        return archive.addField("icon");
      })
      .then(function(){
        // chequeamos que existen los directorios esperados
        expected_dirs.map(function(expected_dir){
          expect(fs.existsSync(expected_dir)).to.be.equal(true, 
            "No generado directorio " + expected_dir + ".");    
        });
      })
      .then(function(){
        // eliminamos el archivo
        return archive.destroy();
      }).then(function(){
        done();
      }).catch(function(err){
        console.log("CATCH", err);
        done(err);
      });
  })

  it("Should store files", function(done){

    var model_name = "Model2";
    var base_path = attachModule.settings.base_path;
    var archive = new ArchiveManager(base_path, model_name);
    var test_files = [
      ["/fixtures/files/alumno1.jpg", "photo"],
      ["/fixtures/files/alumno2.jpg", "photo"],
      ["/fixtures/files/alumno3.jpg", "icon"],
      ["/fixtures/files/alumno4.jpg", "icon"],
      ["/fixtures/files/alumno5.jpg", "icon"],
      ["/fixtures/files/alumno6.jpg", "photo"],
      ["/fixtures/files/alumno7.jpg", "icon"]
    ];

    var expected_files = [
      "photo/1.jpg",
      "photo/2.jpg",
      "icon/3.jpg",
      "icon/4.jpg",
      "icon/5.jpg",
      "photo/6.jpg",
      "icon/7.jpg"
    ].map(function(fname){
      var abspath = path.join(config.root, base_path, 
        model_name, fname);
      logger.info("EXPECTED FILE '%s'.", abspath);
      return abspath;
    });

    archive.create()
      .then(function(){
        // anyadimos los campos
        return Promise.join(
          archive.addField("photo"),
          archive.addField("icon")
        );
      })
      .then(function(){
        // almacenar en el archivo, vinculados a los campos los ficheros
        // de prueba
        Promise.all(
          test_files.map(function(file_and_field, index){
            var file = file_and_field[0];
            var field = file_and_field[1];

            var abs_path = path.join(config.root, file);
            var fname = (index + 1).toString();
            var ext = path.parse(file).ext;

            logger.info(
              "STORING FILE '%s' WITH PARAMETERS (%s, %s)", 
              abs_path, fname, ext);
            return archive.store(field, abs_path, fname, ext, true);
          })
        ).then(function(){
          // verificar que se han generado los ficheros esperados
          expected_files.map(function(expected_file){
            expect(fs.existsSync(expected_file)).to.be.equal(true, 
              "No generado archivo '" + expected_file + "'.");   
          });
        }).then(function(){
          // eliminar el archivo
          return archive.destroy();
        }).then(function(){
          done();
        }).catch(function(error){
          done(error);
        });

      });


  })

  it("Could rely on a database File Model", function(done){
    /** 
      Se intenta probar que el archivo puede trabajar con un modelo
      en lugar de especificar los parametros de los ficheros a guardar 
      de manera directa
    **/

    var base_path = attachModule.settings.base_path;
    var model_name = "Model2";
    var archive = new ArchiveManager(
      base_path, 
      model_name
    );

    var test_files = [
      ["/fixtures/files/alumno1.jpg", "photo"],
      ["/fixtures/files/alumno2.jpg", "photo"],
      ["/fixtures/files/alumno3.jpg", "icon"],
      ["/fixtures/files/alumno4.jpg", "icon"],
      ["/fixtures/files/alumno5.jpg", "icon"],
      ["/fixtures/files/alumno6.jpg", "photo"],
      ["/fixtures/files/alumno7.jpg", "icon"]
    ];

    // regenerar las tablas en base de datos y crear 
    // los directorios del archivo
    Promise.join(
      FileModel.sync(),
      HostModel.sync(),
      archive.create()
    ).then(function(){
      return Promise.join(
        archive.addField("photo"), 
        archive.addField("icon")
      );
    }).then(function(){
      // crear un objeto host para asociarle los archivos
      return HostModel.create({});
    })
    .then(function(host_object){

      return Promise.all(

        test_files.map(function(fname_and_field){

          var fname = fname_and_field[0];
          var field = fname_and_field[1];

          return FileModel.create({
            object_id: host_object.id,
            object_model: host_object.Model.getTableName(),
            object_field: field,
            path: path.join(config.root, fname),
            extension_with_dot: path.parse(fname).ext,
            mimetype: "image/jpeg",
            original_filename: fname
          });

        })

      ).then(function(){

        return FileModel.findAll({
          where: {
            object_id: host_object.id
          }
        });

      });

    }).then(function(file_model_objects){

      return Promise.all(
        file_model_objects.map(function(file_model_object){
          return archive.storeFromObject(file_model_object, true);
        })
      );

    }).then(function(){

      return archive.destroy();

    }).then(function(){
      done();
    }).catch(function(error){
      done(error);
    });

  })

});