'use strict';

// cargar el modelo
var UsuariosFacade = require("../../server/api/Usuario/Usuario.model.js")
var Usuario = UsuariosFacade.Usuario;
var Role = UsuariosFacade.Role;
var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var roles = ["admin", "usuario", "profesor", "alumno"];

    var sequelize = queryInterface.sequelize;

    return sequelize.transaction(function(transaction){

      return Promise.all(
        roles.map(function(rol){
          return Role.create({
              nombre: rol
            }, 
            {transaction: transaction}
          );
        })
      );
      
    });
  },
  down: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    return db.query(
      "DELETE FROM \"Roles\" WHERE NOMBRE IN ('admin', 'usuario', 'profesor', 'alumno')"
    );
  }
};
