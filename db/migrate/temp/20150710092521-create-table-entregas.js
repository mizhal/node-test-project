'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Entregas', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      archivo: {
        type: Sequelize.STRING
      },
      subido: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM(
          "abierta", "pendiente-validacion", 
          "completa", "fallida", "con-error"
          ),
        allowNull: false,
        defaultValue: "abierta"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      rondaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Rondas",
        referencesKey: "id"
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Usuarios",
        referencesKey: "id"
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

