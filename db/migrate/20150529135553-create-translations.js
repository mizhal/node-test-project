'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log(queryInterface.createTable);
    return queryInterface.createTable("Translations", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      key: Sequelize.STRING,
      language: Sequelize.STRING,
      view: Sequelize.STRING,
      value: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE      
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("Translations");
  }
};
