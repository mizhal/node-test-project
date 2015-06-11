'use strict';

// cargar el modelo
var app = require("../../server/app.js");
var Usuario = app.orm.getModel("Usuario");
var Role = app.orm.getModel("Role");
var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var roles = ["admin", "usuario", "profesor", "alumno"];

    return Usuario.findOne({login: "admin"})
      .then(function(admin){

        return Promise.all(
          roles.map(function(rol){
            return Role.create({
              nombre: rol
            });
          }).map(function(rol){
            return rol.then(function(rol_fullfilled){
              return admin.setRoles(rol_fullfilled);
            });
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
