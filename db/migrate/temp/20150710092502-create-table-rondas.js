'use strict';

var Promise = require("bluebird");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Rondas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
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
