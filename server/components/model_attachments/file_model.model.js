/** FileModel 
  for tests and examples

**/

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var FileModel = sequelize.define('FileModel', 
  {// Campos minimos necesarios para funcionar
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    object_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    object_model: {
      type: Sequelize.STRING,
      allowNull: false
    },
    object_field: {
      type: Sequelize.STRING,
      allowNull: false
    },
    path: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    extension_with_dot: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    mimetype: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    original_filename: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {//CONFIGURACION
    timestamps: true,
    tableName: "FileModels"
  }
);

module.exports = exports = FileModel;