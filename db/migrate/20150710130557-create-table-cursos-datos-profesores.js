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
        }
      },
      datosProfesorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: "DatosProfesores",
          key: "id"
        }
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
