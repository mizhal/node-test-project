'use strict';

var Promise = require("bluebird");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addIndex("UsuarioRoles", 
        ["RoleId", "UsuarioId"],
        {
         indexName: "htbm_unique_usuarioroles",
          indicesType: "UNIQUE"
        }
      ),
      queryInterface.addIndex("UsuarioRoles", ["RoleId"]),
      queryInterface.addIndex("UsuarioRoles", ["UsuarioId"])
    ]);
  },
  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeIndex("UsuarioRoles", "htbm_unique_usuarioroles"),
      queryInterface.removeIndex("UsuarioRoles", ["RoleId"]),
      queryInterface.removeIndex("UsuarioRoles", ["UsuarioId"]),
    ]);
  }
};
