'use strict';

var Promise = require("bluebird");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable("CategoriasDeError", {
        id:  {     
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: false
          // no es unique, lo que es unique es el nombre de la categoria padre + el de la categoria hijo
        },
        nivel: {
          type: Sequelize.ENUM('padre', 'hijo'),
          allowNull: false,
          defaultValue: 'hijo'
        },
        descripcion: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        peso: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defalutValue: 100.0
        },
        padreId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: "CategoriasDeError",
          referencesKey: "id"
        }
      }),
      queryInterface.createIndex("CategoriasDeError", ["padreId"])
    ]);

  },
  down: function (queryInterface, Sequelize) {
    return queryInteface.dropTable("CategoriasDeError")
  }
};