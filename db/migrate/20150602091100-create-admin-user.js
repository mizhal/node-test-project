'use strict';

// cargar el modelo
var Usuario = require("server/api/Usuario/Usuario.model.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    var admin = Usuario.build({
      login: "admin",
      password: "admin"
    });
    return admin.habilitar()
      .then(function(admin){
        return admin.save();  
      });
  },

  down: function (queryInterface, Sequelize) {
    return Usuario.findOne({login: "admin"})
      .then(function(admin){
        return admin.destroy();
      })
  }
};
