/*** model_attachments test **/
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

/** deps para generar una pequenya aplicacion **/
var express = require('express');
var multer  = require('multer');
/** FIN: deps para generar una pequenya aplicacion **/

/** configuracion general **/
var config /* :IPFCConfig */ = require("../../config/environment");

/** Inicializacion de los logs **/
var logger_module /* :ILoggerModule */ = require("../logger");
logger_module.setConfig(config);
var logger /* :ILogger */ = logger_module.getLogger();
/** FIN: Inicializacion de los logs **/

/** configuracion de archivos adjuntos **/
var attachModule /* :IModelAttachments */ = require("./index");
attachModule.setSettings({base_path: "/test-archive"});
/** FIN: configuracion de archivos adjuntos **/

/** dependencias de otros modelos necesarios para el plugin **/
var FileModel = require("./file_model.model");
/** FIN: dependencias de otros modelos necesarios para el plugin **/

describe("model_attachments", function(){

  it("It binds files to model and creates archive directories", function(){
    
    var BaseModel = require("./base_model.model.js");
    var table_name = BaseModel.getTableName();

    // debe existir el archivo
    var base_path = attachModule.settings.base_path;
    expect(
      fs.existsSync(path.join(process.env.PWD, base_path, table_name))
      ).to.equal(true);
    expect(
      fs.existsSync(path.join(process.env.PWD, base_path, table_name, "photo"))
      ).to.equal(true);
    expect(
      fs.existsSync(path.join(process.env.PWD, base_path, table_name, "cv"))
      ).to.equal(true);
  })

  it("It can actually bind files", function(){

    var BaseModel = require("./base_model.model.js");

    // controller 
    var BaseModelController = {
      index: function(req, res, next){
        BaseModel.create({})
          .then(function(base_object){
            base_object.attachFiles(req.files);
          })
      }
    }

    // app con express
    var app = express();
    var upload = multer({ dest: 'uploads/' });
    app.post("/bases", upload.fields([
      {name: "photo", maxCount: 1},
      {name: "cv", maxCount: 1}
    ]), BaseModelController.index);

    //hacer una peticion para subir los archivos
    request(app)
      .post("/bases")
      .attach("photo", "../../fixtures/files/alumno1.jpg")
      .attach("cv", "../../fixtures/files/resume.pdf")
      .expect(200)
    
  })

})