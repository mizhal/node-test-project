'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("Usuarios", "nombre_completo", Sequelize.STRING(255));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Usuarios", "nombre_completo");
  }
};
