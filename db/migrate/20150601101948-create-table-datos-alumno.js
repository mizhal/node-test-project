'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    db.query('create table "DatosAlumno"(    \
      id integer primary key not null,       \
      nombre varchar(20) not null,           \
      codigo_uo varchar(10) not null,        \
      estado integer not null,               \
      foto varchar(255),                     \
      usuario_id integer not null references "Usuarios"(id) on delete set null,\
      "createdAt" timestamp with time zone,                         \
      "updatedAt" timestamp with time zone                         \
      )');
  },

  down: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    db.query('drop table "DatosAlumno"');
  }
};
