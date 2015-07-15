'use strict';

var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('CursosDatosProfesores', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cursoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Cursos",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      datosProfesorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: "DatosProfesores",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
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
        queryInterface.addIndex("CursosDatosProfesores", 
          ["cursoId", "datosProfesorId"],
          {
           indexName: "htbm_unique_curso_datos_profesor",
            indicesType: "UNIQUE"
          }
        ),
        queryInterface.addIndex("CursosDatosProfesores", ["cursoId"]),
        queryInterface.addIndex("CursosDatosProfesores", ["datosProfesorId"])
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('CursosDatosProfesores');
  }
};
