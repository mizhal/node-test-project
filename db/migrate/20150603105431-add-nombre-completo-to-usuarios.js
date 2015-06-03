'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("Usuarios", "nombre_completo", Sequelize.STRING(255));
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn("Usuarios", "nombre_completo");
  }
};
