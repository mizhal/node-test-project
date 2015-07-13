'use strict';

var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Cursos', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      anyo: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }).then(function(){
      // indices
      return Promise.all([
          queryInterface.addIndex("Cursos", ["slug"]),
        ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Cursos');
  }
};
