if(!process.env.NODE_ENV){
  process.env.NODE_ENV = "development";
}

console.log("Creating fixtures in '%s' database", process.env.NODE_ENV);

// load fixtures
var config = require('../server/config/local.env.js');
var envconfig = require('../server/config/database.json');
var sequelize_fixtures = require('sequelize-fixtures');

//models
var Cursos = require("../server/api/cursos/cursos.model.js");
sequelize_fixtures.loadFile("fixtures/cursos.fixtures.yml", Cursos);
