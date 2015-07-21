if(!process.env.NODE_ENV){
  process.env.NODE_ENV = "development";
}

console.log("Creating fixtures in '%s' database", process.env.NODE_ENV);

// load fixtures
var config = require('../server/config/local.env.js');
var envconfig = require('../server/config/database.json');
var sequelize_fixtures = require('sequelize-fixtures');

//models
var Usuarios = require("../server/api/Usuario/Usuario.model.js");

// disable temporarily validation hooks (to avoid password generation)
Usuarios.Usuario.options.hooks['beforeValidate'] = null

sequelize_fixtures.loadFile("fixtures/usuarios.fixtures.yml", Usuarios);

var Cursos = require("../server/api/cursos/cursos.model.js");
sequelize_fixtures.loadFile("fixtures/cursos.fixtures.yml", Cursos);
