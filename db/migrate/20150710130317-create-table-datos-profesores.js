'use strict';

var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('DatosProfesores', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_completo: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id"
        }
      }
    }).then(function(){
      // indices
      return Promise.all([
          queryInterface.addIndex('DatosProfesores', ["usuarioId"]),
          queryInterface.addIndex('DatosProfesores', ["slug"])
        ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('DatosProfesores');
  }
};
