//console

var repl = require("repl");
var Promise = require("bluebird");

var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

var ROOT_PATH = ".";

/*****************
 * UTILIDADES
 *********************/
function initUtils(replServer){
  var Utils = {
    /* Cargar el resultado de una promesa en una variable asincronamente */
    let: function(symbol, promise){
      promise.then(function(value){
        replServer.context[symbol] = value;
        console.log("SYMBOL %s SET", symbol);
      });
    }
  };

  for(var i in Utils){
    replServer.context[i] = Utils[i];
  };

  console.log("Cargando utilidades de consola");
}

/*****************
 * FIN UTILIDADES
 *********************/

function init(repl, sequelize){
  var replServer = null;
  return getModelsAndPaths(ROOT_PATH)
    .then(function(all){
      replServer = repl.start({
       prompt: "$$ > ",
      });
      return all;
    })
    .map(function(model_name_and_filename){
      var model_name = model_name_and_filename.name;
      var filename = model_name_and_filename.file;
      replServer.context["sequelize"] = sequelize;

      console.log("Import model " + model_name);
      replServer.context[model_name] = require(filename);
      initUtils(replServer);
      return model_name_and_filename;
    })
    .then(function(all){
      console.log("Imported all models found");
      sequelize.makeRelations();
      return all;
    })
    .catch(function(error){
      console.log("init error = " + error);
    })
    ;
}

// (root_path:String) -> [file:String*]
function searchForModels(root_path){
  // genera una tuberia paralela de procesamiento 
  // que recorre un directorio recursivamente y retorna 
  // las rutas de los archivos que contengan ".model."
  
  return fs.readdirAsync(root_path)
    .map(function(filename){ // relative path -> abs path
      return path.resolve(root_path, filename);
    })
    .map(function(file){ // abs_path -> [file-stats, abs_path]
      return Promise.props({
        stat: fs.statAsync(file), 
        file: file
      });
    })
    .filter(function(file_bundle){
      var fname = file_bundle.file;
      var filestat = file_bundle.stat;
      //dejar archivos model y directorios.
      return (fname && fname.indexOf(".model.") != -1) || !filestat.isFile();
    })
    .map(function(file_bundle){ // [file-stats, abs_path] -> abs_path || [abs_path*] 
      var filestat = file_bundle.stat;
      var file = file_bundle.file;

      if(filestat.isFile()){
        return file;
      } else {
        return searchForModels(file);
      }
    })
    .then(function(file_nested_arrays){ // FLATTEN
      // notar que el array lleva promesas
      return Promise.all(file_nested_arrays)
        .filter(function(file_or_array){
          return file_or_array != null && file_or_array.length > 0;
        })
        .map(function(file_or_array){
          if (!file_or_array instanceof Array){
            return [file_or_array];
          } else {
            return file_or_array;
          }
        }).then(function(array){
          return array.reduce(function(a,b){return a.concat(b);}, []);
        });
    })
    .catch(function(error){
      console.log("searchForModels ERROR = " + error);
    });
}

// -> {name:String, file:String}
function getModelsAndPaths(){
  return searchForModels(ROOT_PATH)
    .map(function(filename){
      var re = new RegExp(/^([^.]+)[.].*$/);
      var model_name = re.exec(path.basename(filename))[1];
      return {name: model_name, file: filename};
    })
    .catch(function(error){
      console.log("Error getModelsAndPaths: " + error);
    });
};

//inicializar el REPL
process.env.NODE_ENV = process.env.NODE_ENV || "development";
var sequelize = require("./components/sequelize_singleton");
var repl = require("repl");
init(repl, sequelize).then(function(){
  console.log("REPL Inicializado");
});