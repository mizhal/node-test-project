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
        allowNull: false,
        unique: true
      },
      slug: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      anyo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }).then(function(){
      // indices
      return Promise.all([
          queryInterface.addIndex("Cursos", ["slug"]),
          queryInterface.addIndex("Cursos", 
            ["nombre", "anyo"],
            {
              indexName: "unique_nombre_anyo",
              indicesType: "UNIQUE"
            }
          )
        ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Cursos');
  }
};
