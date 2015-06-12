'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

// doc: http://docs.sequelizejs.com/en/latest/docs/models-definition/

var Role = sequelize.define('Role', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      // es UNIQUE por definicion en la base de datos
    }
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
{
  tablename: "Roles"
});

Role.relations = function(seq_context){
  Role.belongsToMany(seq_context["Usuario"], {through: seq_context["UsuarioRoles"]});
};

// Hook para generar el SLUG
var slug = require('slug');
Role.hook("beforeValidate", function(role){
  if(role.nombre){
    role.slug = slug(role.nombre);
  }
});

// Registrar modelo con el ORM
sequelize.registerModel("Role", Role);

module.exports = Role;