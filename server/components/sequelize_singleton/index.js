// single connection to sequelize

// Conexion con Sequelize
var sequelize_db_configs = require("../../config/database.json");
var current_config = sequelize_db_configs[process.env.NODE_ENV];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(current_config.database, current_config.username, current_config.password, {
  host: current_config.host,
  port: current_config.port,
  dialect: current_config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// resolver las dependencias circulares en las relaciones
var context = [];
sequelize.registerModel = function(modelname, object){
  context[modelname] = object;
}
sequelize.makeRelations = function(){
  for(var i in context){
    if(context[i].relations)
      context[i].relations(context);
  }
}

module.exports = sequelize;