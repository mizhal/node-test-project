'use strict';

// cargar el modelo
var UsuariosFacade = require("../../server/api/Usuario/Usuario.model.js")
var Usuario = UsuariosFacade.Usuario;
var Role = UsuariosFacade.Role;
var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var roles = ["admin", "usuario", "profesor", "alumno"];
    return Usuario.find({login: "admin"})
      .then(function(admin){
        return admin.setRolesEnTransaccion(roles);
      })
  },
  down: function (queryInterface, Sequelize) {
  }
};