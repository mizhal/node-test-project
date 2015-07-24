/** Tests de ArchiveManager **/

'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var expect = require('chai').expect;

var Promise = require('bluebird');
var path = require('path');
var fs = require("fs");

var config = require("../../config/environment");
/** Inicializacion de los logs **/
var bunyan = require('bunyan');
var logger = bunyan.createLogger({
  name: "test-pfc-laminas", 
  streams: [
    {
      level: "trace",
      path: path.join(config.root, "/log/test-output.log")
    }
  ]
});
/** FIN: Inicializacion de los logs **/

var ArchiveManager = require("./archive-manager.js");

var model_name = "Model";

describe("ArchiveManager", function() {

  it("Should create folders", function(done){

    var base_path = "/test-archive";
    var archive = new ArchiveManager(base_path, model_name, ["photo", "icon"]);

    var expected_dirs = [
      path.join(process.env.PWD, base_path),
      path.join(process.env.PWD, base_path, model_name),
      path.join(process.env.PWD, base_path, model_name, "photo"),
      path.join(process.env.PWD, base_path, model_name, "icon")
    ]; 

    archive.create()
      .then(function(){
        expected_dirs.map(function(expected_dir){
          expect(fs.existsSync(expected_dir)).to.be.equal(true, 
            "No generado directorio " + expected_dir + ".");    
        });
      })
      .then(function(){
        return archive.destroy();
      }).then(function(){
        done();
      }).catch(function(err){
        console.log("CATCH", err);
        done(err);
      });
  })


  it("Should store files", function(done){

    var base_path = "/test-archive";
    var model_name = "Model2";
    var archive = new ArchiveManager(base_path, model_name, ["photo", "icon"]);
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
      var abspath = path.join(config.root, base_path, model_name, fname);
      logger.info("EXPECTED FILE '%s'.", abspath);
      return abspath;
    });

    archive.create()
      .then(function(){
        
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
          expected_files.map(function(expected_file){
            expect(fs.existsSync(expected_file)).to.be.equal(true, 
              "No generado archivo '" + expected_file + "'.");   
          });
        }).then(function(){
          return archive.destroy();
        }).then(function(){
          done();
        }).catch(function(error){
          done(error);
        });

      });


  })

});