'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

// doc: http://docs.sequelizejs.com/en/latest/docs/models-definition/

var Usuario = sequelize.define('Usuario', {
  login: {
    type: Sequelize.STRING,
    validate: {
      notNull:true
    }
  },
  password_encrypted: {
    type: Sequelize.STRING,
    validate: {
      notNull:true
    }
  },
  ultimo_acceso: {
    type: Sequelize.DATE
  },
  puede_entrar: Sequelize.BOOLEAN
});

module.exports = Usuario;
