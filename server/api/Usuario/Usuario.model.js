'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var Promise = require("bluebird");
//password hashing
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var ROLE_SLUG_FIELD_SIZE = 32;

/*** MODELO ROLE **/
var Role = sequelize.define('Role', {
  nombre: {
    type: Sequelize.STRING(32),
    allowNull: false,
    validate: {
      // es UNIQUE por definicion en la base de datos
    }
  },
  slug: {
    type: Sequelize.STRING(ROLE_SLUG_FIELD_SIZE),
    allowNull: false
  }
},
{
  tablename: "Roles",
  timestamps: true,
  scopes: {
    only_slug: {
      attributes: ["slug"]
    },
    common: {
      attributes: ["id", "nombre", "slug"]
    }
  }
});

// Hook para generar el SLUG
var slug = require('slug');
Role.hook("beforeValidate", function(role){
  console.log("Slug de Role = ", role.nombre, " -> ")
  return slug.generator(
    role, 
    Role,
    role.nombre,
    "slug",
    ROLE_SLUG_FIELD_SIZE
  ).then(function(){
    console.log("Slug final = ", role.slug);
  });
});

/*** FIN: MODELO ROLE **/

/*** MODELO USUARIO **/
var USUARIO_SLUG_FIELD_SIZE = 20;
var Usuario = sequelize.define('Usuario', 
  { // persistent fields
    login: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
      }
    },

    slug: {
      type: Sequelize.STRING(USUARIO_SLUG_FIELD_SIZE),
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
      allowNull: true,
      defaultValue: new Date()
    },

    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    puede_entrar: Sequelize.BOOLEAN,

    nombre_completo: Sequelize.STRING(255),

    roles: {
      type: Sequelize.VIRTUAL,
      get: function(){
        if(this.roles_full){
          return this.roles_full.map(function(rol){
            return rol.slug;
          });
        } else {
          return [];
        }
      },
      include: [
        {model: Role, attributes: ["slug"], as:"roles_full"}
      ]
    }
  },
  { 
    timestamps: true,
    // Object features and non persistent fields
    /** SCOPES **/
    scopes: {
      common: { // ATRIBUTOS MAS COMUNES
        attributes: [
          "id", "login", "nombre_completo", 
          "slug", "ultimo_acceso", "puede_entrar", "roles"
          ]
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
      },

      anyadirRole: function(role_slug){
        var object = this;
        return Role.find({
            where: {
              slug: role_slug
            }
          }).then(function(role){
            return object.addRoles_full(role);
          });
      },

      setRolesEnTransaccion: function(array_slugs_role){
        var object = this;
        return sequelize.transaction(function(trans){
          return Promise.all(
            array_slugs_role.map(function(role_slug){
              return Role.find({
                where: {
                  slug: role_slug
                }, 
                transaction: trans
              });
            })
          ).then(function(roles){
            return Promise.all(
              roles.map(function(role){
                return object.setRoles_full(role, {transaction: trans});  
              })
            );
          });
        });
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
    }
  }
);

// Hook para generar el SLUG
var slug = require('../../components/slugger');
Usuario.hook("beforeValidate", function(usuario){
  return slug.generator(
    usuario, 
    Usuario, 
    usuario.login,
    "slug",
    USUARIO_SLUG_FIELD_SIZE
  );
});

/*** FIN: MODELO USUARIO **/

/********* RELACIONES ****/
// Tabla del join Usuario *---* Role
var UsuarioRoles = sequelize.define('UsuarioRoles', {
});

Usuario.belongsToMany(Role, {through: UsuarioRoles, as: "roles_full"});
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

sequelize.initVirtualFields();

module.exports = UsuariosFacade;