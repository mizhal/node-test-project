'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    return db.query('create table "Usuarios"(             \
      id serial primary key not null,                     \
      login varchar(20) not null unique,                  \
      slug varchar(20) not null unique,                   \
      password_encrypted varchar(64) not null,            \
      salt varchar(30) not null,                          \
      ultimo_acceso timestamp with time zone,             \
      puede_entrar boolean default false,                 \
      "createdAt" timestamp with time zone,               \
      "updatedAt" timestamp with time zone                \
      )');
  },

  down: function (queryInterface, Sequelize) {
    var db = queryInterface.sequelize;
    return db.query('drop table "Usuarios"');
  }
};
