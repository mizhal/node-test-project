/** Tests de ArchiveManager **/

'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var expect = require('chai').expect;

var Promise = require('bluebird');
var path = require('path');
var fs = require("fs");

var ArchiveManager = require("./archive-manager.js");

var model_name = "Model";

describe("ArchiveManager", function() {

  it("Should create files", function(done){

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
  });

});