'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("UsuarioRoles", {
      "id": {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      "RoleId": {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Roles",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      "UsuarioId": {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Usuarios",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      "createdAt": Sequelize.DATE,
      "updatedAt": Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("UsuarioRoles");
  }
};
