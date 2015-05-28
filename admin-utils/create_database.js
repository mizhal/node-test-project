/* Pruebas de creación de la base de datos */

var Sequelize = require('sequelize');
var config = require('../server/config/local.env');
var Promise = require('bluebird');
var using = Promise.using;

var fs = Promise.promisifyAll(require("fs"));
var pg = Promise.promisifyAll(require("pg"));

// crear la base de datos y el usuario por comando
// se usan las bindings de PostgreSQL directamente

/** CONEXION A LA BASE DE DATOS **/
var getConexionDB = function(){
  var conString = "postgres://" + config.SQL_ROOT_USER  + ":" + config.SQL_ROOT_PASSWORD + 
    "@" + config.SQL_HOST + "/postgres"  ;

  var done_continuation = null;

  // connectAsyncDevuelve 2 resultados, por eso los recogemos con spread
  return pg.connectAsync(conString).spread(function(client, done){
    // done es la continuacion
    // segun la documentacion del driver de Postgresql, manda el cliente de vuelta al pool
    // liberando el recurso de la conexion
    done_continuation = done; 
    return client;
  }).disposer(function(){
    if(done_continuation){
      done_continuation();
      console.log("Conexion a la base de datos liberada.");
    }
  });
}

/** CREACION DEL USUARIO DECLARADO EN LA CONFIGURACION **/
var crearUsuario = Promise.promisify(function (client, next){

  var command = 'CREATE USER "' + config.SQL_USERNAME + '" WITH PASSWORD \'' +
    config.SQL_PASSWORD + "'";

  client.queryAsync(command).then(function(res){
    console.log("Usuario " + config.SQL_USERNAME + " creado correctamente.");
    next();
  }).catch(function(error){
    console.error("No se ha creado el usuario porque ya existía.", error);
    next();
  });

});

/** CREACION DE LA BASE DE DATOS DECLARADA EN LA CONFIGURACION */
var crearBaseDeDatos = Promise.promisify(function (client, next){

  var command = 'CREATE DATABASE "' + config.SQL_DATABASE + '" WITH OWNER "' +
    config.SQL_USERNAME + '"';

  return client.queryAsync(command).then(function(result){
    console.log("Base de datos creada correctamente.");
    next();
  }).catch(function(error){
    console.error("No se ha creado la base de datos porque ya existia.", error);
    next();
  });

});

/** CREAR TODAS LAS DEPENDENCIAS EN BASE DE DATOS **/
var crearTodo = Promise.promisify( function(next){

  using(getConexionDB(), function(cliente_db){
    return crearUsuario(cliente_db)
      .then(function(res){
        return crearBaseDeDatos(cliente_db).then(function(res){
          console.log("Client end");
          cliente_db.end();
        });
      });
  }).then(function(){
    return next();
  }).catch(function(error){
    console.log("Error en el using");
  });

});

/** MAIN **/
crearTodo().then(function(res){

  var sequelize = new Sequelize(config.SQL_DATABASE, config.SQL_USERNAME, config.SQL_PASSWORD, {
    host: config.SQL_HOST,
    dialect: config.SQL_DIALECT,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

  var User = sequelize.define('User', {
      userID: Sequelize.INTEGER,
      userName: Sequelize.TEXT,
      password: Sequelize.TEXT
  }, {
      instanceMethods: {
          getUserId: function() {
              return this.userID;
          }
      }
  });

  sequelize.sync().then(function(){
    sequelize.close();  
  });

}).finally(function(){
  console.log("Finalizado");
});
  




