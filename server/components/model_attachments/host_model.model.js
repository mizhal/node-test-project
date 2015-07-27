/**
 * class HostModel
 ***/

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");
var attach = require("./index");

// dependencias de otros modelos
var FileModel = require("./file_model.model");

var HostModel = sequelize.define('HostModel', 
  {// Campos minimos necesarios para funcionar
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  {//CONFIGURACION
    timestamps: true,
    tableName: "HostModels"
  }
);

attach.enableAttachments(HostModel, FileModel)
attach.defineAttachment(HostModel, "photo");  
attach.defineAttachment(HostModel, "cv");

module.exports = exports = HostModel;