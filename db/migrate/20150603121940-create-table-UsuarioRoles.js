'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("UsuarioRoles", {
      "id": {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      "RoleId": {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      "UsuarioId": {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      "createdAt": Sequelize.DATE,
      "updatedAt": Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("UsuarioRoles");
  }
};
