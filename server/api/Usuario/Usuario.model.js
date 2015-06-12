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
    ultimo_acceso: {
      type: Sequelize.DATE,
      allowNull: true
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    puede_entrar: Sequelize.BOOLEAN,
    nombre_completo: Sequelize.STRING(255)
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
        return Usuario.findAll(query).map(function(usuario){
          var roles = usuario["Roles"];
          usuario["Roles"] = roles.map(function(rol){return rol.slug;});
          return usuario;
        });
      },
      findOneWithRoles: function(query){
        var Role = sequelize.getModel("Role");
        query["include"] = {model: Role, as: "Roles"};
        return Usuario.findOne(query).then(function(usuario){
          var roles = usuario["Roles"];
          usuario["Roles"] = roles.map(function(rol){return rol.slug;});
          return usuario;
        });
      }
    }
  }
);

// Tabla del join Usuario *---* Role
var UsuarioRoles = sequelize.define('UsuarioRoles', {
});

// Definición de relaciones
Usuario.relations = function(seq_context){
  // Usuario *---* Role
  Usuario.belongsToMany(seq_context["Role"], {through: UsuarioRoles, as: "Roles"});
};

// Registro de Usuario con el ORM para poder realizar operaciones fuera de tiempo
sequelize.registerModel("Usuario", Usuario);
sequelize.registerModel("UsuarioRoles", UsuarioRoles);

// Hook para generar el SLUG
//slugs 
var slug = require('slug');
Usuario.hook("beforeValidate", function(usuario){
  if(usuario.login){
    usuario.slug = slug(usuario.login);
  }
});

module.exports = Usuario;
