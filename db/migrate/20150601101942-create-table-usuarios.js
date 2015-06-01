'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    db.query('create table "Usuarios"(             \
      id serial primary key not null,             \
      login varchar(20) not null,                  \
      password_encrypted varchar(64) not null,     \
      ultimo_acceso timestamp with time zone not null,            \
      puede_entrar boolean default false,          \
      "createdAt" timestamp with time zone,                         \
      "updatedAt" timestamp with time zone                          \
      )');
  },

  down: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    db.query('drop table "Usuarios"');
  }
};
