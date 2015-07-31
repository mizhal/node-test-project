/** dependencias para definir modelos con adjuntos **/
var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");
var attachModule /* :IModelAttachments */ = require("./index");
/** FIN: dependencias para definir modelos con adjuntos **/

/** dependencias de modelos **/

var BaseModel = sequelize.define('BaseModel', 
  {// Campos minimos necesarios para funcionar
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  {//CONFIGURACION
    timestamps: true,
    tableName: "BaseModels"
  }
);

attachModule.enableAttachments(BaseModel);
attachModule.defineAttachment(BaseModel, "photo");  
attachModule.defineAttachment(BaseModel, "cv");

module.exports = exports = BaseModel;