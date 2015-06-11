// drop database

var Sequelize = require('sequelize');
var config = require('../server/config/local.env.js');
var envconfig = require('../server/config/database.json');
var Promise = require('bluebird');
var using = Promise.using;

var fs = Promise.promisifyAll(require("fs"));
var pg = Promise.promisifyAll(require("pg"));

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
};


/** BORRADO DE LA BASE DE DATOS DECLARADA EN LA CONFIGURACION */
var borrarBaseDeDatos = Promise.promisify(function (client, next){

  var environments = ["development", "test", "production"];

  if(process.argv.length > 2){
    if(environments.indexOf(process.argv[2]) != -1){
      environments = [process.argv[2]]
    } else if (process.argv[2].toLowerCase() == "all"){
      environments = ["development", "test", "production"];
    }
  } else {
    console.log("Para el script de BORRADO es OBLIGATORIO especificar el entorno de ejecución (development, test, production o all)");
    return next();
  }

  Promise.map(environments, function(environment){

    var this_config = envconfig[environment];
    var command = 'DROP DATABASE "' + this_config.database + '"';

    return client.queryAsync(command).then(function(result){
      console.log("Base de datos %s BORRADA correctamente.", this_config.database);
    }).catch(function(error){
      console.log("No se ha podido BORRAR la base de datos %s: %s", this_config.database, error);
    });

  }).then(function(){
    next();
  });

});

var borrarTodo = Promise.promisify( function(next){

  using(getConexionDB(), function(cliente_db){
      return borrarBaseDeDatos(cliente_db).then(function(res){
        console.log("Desconexión de la cuenta de administracion de postgresql");
        cliente_db.end();
      });
  }).then(function(){
    return next();
  }).catch(function(error){
    console.error("Error con la conexión de administración de postgresql", error);
  });

});

/** MAIN **/
if(process.argv.length > 2){
  borrarTodo().then(function(res){
    console.log("Puesta a punto de la Base de Datos finalizada.");
  });
} else {
  console.log("Para el script de BORRADO es OBLIGATORIO especificar el entorno de ejecución (development, test, production o all)");
}

