'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

// doc: http://docs.sequelizejs.com/en/latest/docs/models-definition/

var Role = sequelize.define('Role', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
    }
  }
},
{
  tablename: "Roles"
});

Role.relations = function(seq_context){
  Role.belongsToMany(seq_context["Usuario"], {through: "UsuarioRoles"});
};

sequelize.registerModel("Role", Role);

module.exports = Role;