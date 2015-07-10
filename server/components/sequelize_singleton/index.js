// single connection to sequelize

// Conexion con Sequelize
var sequelize_db_configs = require("../../config/database.json");
var current_config = sequelize_db_configs[process.env.NODE_ENV];
var Sequelize = require('sequelize');
require('sequelize-virtual-fields')(Sequelize);
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
sequelize.context = [];
sequelize.registerModel = function(modelname, object){
  sequelize.context[modelname] = object;
}
sequelize.makeRelations = function(){
  for(var i in sequelize.context){
    if(sequelize.context[i].relations)
      sequelize.context[i].relations(sequelize.context);
  }
}
sequelize.getModel = function(name){
  return sequelize.context[name];
}

module.exports = sequelize;