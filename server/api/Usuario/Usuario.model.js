'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var Promise = require("bluebird");
//password hashing
var bcrypt = Promise.promisifyAll(require('bcrypt'));

/*** MODELO ROLE **/
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
  tablename: "Roles",
  scope: {
    only_slug: {
      attributes: ["slug"]
    }
  }
});

// Hook para generar el SLUG
var slug = require('slug');
Role.hook("beforeValidate", function(role){
  if(role.nombre){
    role.slug = slug(role.nombre);
  }
});

/*** FIN: MODELO ROLE **/

/*** MODELO USUARIO **/
var Usuario = sequelize.define('Usuario', 
  { // persistent fields
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      }
    },

    slug: {
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

    password: {
      type: Sequelize.VIRTUAL,
      get: function(){return this._password;},
      set: function(pass_value){
        this._password = pass_value;
      }
    },

    ultimo_acceso: {
      type: Sequelize.DATE,
      allowNull: true
    },

    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    puede_entrar: Sequelize.BOOLEAN,

    nombre_completo: Sequelize.STRING(255),

    // campo virtual con los slugs de los roles para la ui
    roles: {
      type: Sequelize.VIRTUAL,
      get: function(){
        // se supone que estan precargados con include
        return this["Roles"].map(function(rol){return rol.slug;});
      },
      include : [
        {model: Role, attributes: ["slug"]}
      ]
    }
  },
  { // Object features and non persistent fields
    /** SCOPES **/
    scopes: {
      common: { // ATRIBUTOS MAS COMUNES
        attributes: ["id", "login", "nombre_completo", "slug", "ultimo_acceso", "puede_entrar"],
      }
    },
    /** METODOS **/
    instanceMethods: {

      habilitar: function(){
        this.puede_entrar = true;
        return this.save();
      },

      autenticar: function(password){
        return this.password_encrypted == bcrypt.hashSync(password, this.salt);
      }


    },
    // Lifecycle callbacks
    hooks: {
      beforeValidate: function(usuario, opciones, continuacion){
        //asincronamente
        bcrypt.genSaltAsync(10)
          .then(function(salt) {
            usuario.salt = salt;
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
    },
    classMethods: {
      /** Metodo de conveniencia para optener el campo roles desnormalizado */
      findAllWithRoles: function(query){
        var Role = sequelize.getModel("Role");
        query["include"] = {model: Role, as: "Roles"};
        return Usuario.findAll(query);
      },
      findOneWithRoles: function(query){
        var Role = sequelize.getModel("Role");
        query["include"] = {model: Role, as: "Roles"};
        return Usuario.findOne(query);
      }
    }
  }
);

// Hook para generar el SLUG
//slugs 
var slug = require('slug');
Usuario.hook("beforeValidate", function(usuario){
  if(usuario.login){
    usuario.slug = slug(usuario.login);
  }
});
/*** FIN: MODELO USUARIO **/

/********* RELACIONES ****/
// Tabla del join Usuario *---* Role
var UsuarioRoles = sequelize.define('UsuarioRoles', {
});

Usuario.belongsToMany(Role, {through: UsuarioRoles, as: "Roles"});
Role.belongsToMany(Usuario, {through: UsuarioRoles, as: "usuarios"});
/********* FIN: RELACIONES ****/

/** FACADE **/
var UsuariosFacade = {
  Usuario: Usuario,
  Role: Role,
  getUser: function(user_id){

  },
  setUser: function(user_data){

  },
  listUsers: function(query_filter){

  },
  getRole: function(role_id){

  },
  setRole: function(role_data){

  }
};
/** FIN: FACADE **/

module.exports = UsuariosFacade;