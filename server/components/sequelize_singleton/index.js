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

module.exports = sequelize;