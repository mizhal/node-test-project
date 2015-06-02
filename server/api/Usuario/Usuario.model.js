'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var Promise = require("bluebird");
//password hashing
var bcrypt = Promise.promisifyAll(require('bcrypt'));

// doc: http://docs.sequelizejs.com/en/latest/docs/models-definition/
var Usuario = sequelize.define('Usuario', 
  { // persistent fields
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      }
    },
    password_encrypted: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      }
    },
    ultimo_acceso: {
      type: Sequelize.DATE,
      allowNull: true
    },
    puede_entrar: Sequelize.BOOLEAN
  },
  { // Object features and non persistent fields
    getterMethods: {
      password: function(){return this._password;}
    },

    setterMethods: {
      password: function(pass_value){
        this._password = pass_value;
      }
    },
    instanceMethods: {
      habilitar: function(){
        this.puede_entrar = true;
        return this.save();
      }
    },
    // Lifecycle callbacks
    hooks: {
      beforeValidate: function(usuario, opciones, continuacion){
        //asincronamente
        bcrypt.genSaltAsync(10)
          .then(function(salt) {
            return bcrypt.hashAsync(usuario.password, salt);
          })
          .then(function(hash){
            usuario.password_encrypted = hash;
            return continuacion(null, usuario);            
          })
          .catch(function(err){
            return continuacion(err, usuario);
          });
      }
    }
  }
);

module.exports = Usuario;
