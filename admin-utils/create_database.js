/* Creación de la base de datos */

var Sequelize = require('sequelize');
var config = require('../server/config/local.env.js');
var envconfig = require('../server/config/database.json');
var Promise = require('bluebird');
var using = Promise.using;

var fs = Promise.promisifyAll(require("fs"));
var pg = Promise.promisifyAll(require("pg"));

// crear la base de datos y el usuario por comando
// se usan las bindings de PostgreSQL directamente

/** CONEXION A LA BASE DE DATOS **/
var getConexionDB = function(){
  /*** esta funcion esta pensada para usarse dentro del contexto creado por la 'directiva' using 
    de la librería bluebird, pues lleva un disposer
  **/
  var conString = "postgres://" + config.SQL_ROOT_USER  + ":" + config.SQL_ROOT_PASSWORD + 
    "@" + config.SQL_HOST + ":" + config.SQL_PORT + "/postgres";

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
    console.log("No se ha creado el usuario porque ya existía.");
    next();
  });

});

/** CREACION DE LA BASE DE DATOS DECLARADA EN LA CONFIGURACION */
var crearBaseDeDatos = Promise.promisify(function (client, next){

  var environments = ["development", "test", "production"];

  if(process.argv.length > 2){
    if(environments.indexOf(process.argv[2]) != -1){
      environments = [process.argv[2]]
    } else if (process.argv[2].toLowerCase() == "all"){
      environments = ["development", "test", "production"];
    }
  }

  Promise.map(environments, function(environment){

    var this_config = envconfig[environment];
    var command = 'CREATE DATABASE "' + this_config.database + '" WITH OWNER "' +
      this_config.username + '"';

    return client.queryAsync(command).then(function(result){
      console.log("Base de datos " + this_config.database + " creada correctamente.");
    }).catch(function(error){
      console.log("No se ha creado la base de datos " + this_config.database + " porque ya existia.");
    });

  }).then(function(){
    next();
  });

});

/** CREAR TODAS LAS DEPENDENCIAS EN BASE DE DATOS **/
var crearTodo = Promise.promisify( function(next){

  using(getConexionDB(), function(cliente_db){
    return crearUsuario(cliente_db)
      .then(function(res){
        return crearBaseDeDatos(cliente_db).then(function(res){
          console.log("Desconexión de la cuenta de administracion de postgresql");
          cliente_db.end();
        });
      });
  }).then(function(){
    return next();
  }).catch(function(error){
    console.error("Error con la conexión de administración de postgresql", error);
  });

});

/** MAIN **/
crearTodo().then(function(res){
  console.log("Puesta a punto de la Base de Datos finalizada.");
});