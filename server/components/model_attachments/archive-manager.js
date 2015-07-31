/**
  class ArchiveManager

**/

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs.extra'));
var path = require("path");
var mkdirp = require("mkdirp");

var logger_module /*:ILoggerModule*/ = require("../logger");
var logger /*:ILogger*/ = logger_module.getLogger();

function ArchiveManager(base_path, model_name){
  this.model_name = model_name;
  this.base_path = path.join(process.env.PWD, base_path);
  this.fields = [];
};

ArchiveManager.prototype = {
  moveFile: function(source, destination){
    /** (string, string) -> Promise **/
    return this.copyFile(source, destination).then(function(){
      return fs.unlinkAsync(source);
    });
  },
  copyFile: function(source, destination){
    /** (string, string) -> Promise **/
    var defer = Promise.defer();
    var fsSource = fs.createReadStream(source);
    var fsDestination = fs.createWriteStream(destination);

    fsSource.pipe(fsDestination)
    fsSource.on("end", function(){
      defer.resolve();
    });

    return defer.promise;
  },
  create: function(){
    var abs_path = path.join(this.base_path, this.model_name);
    var deleted_path = path.join(abs_path, "_deleted");

    return fs.mkdirpAsync(abs_path);
  },
  createSync: function(){
    var abs_path = path.join(host.base_path, host.model_name);
    fs.mkdirpSync(abs_path);
  },
  addField: function(field_name){
    if(this.fields.indexOf(field_name) == -1){
      this.fields.push(field_name);
    }

    var abs_path = path.join(this.base_path, this.model_name, field_name);
    var deleted_path = path.join(abs_path, "_deleted");

    return fs.mkdirpAsync(abs_path).then(function(){
      return fs.mkdirpAsync(deleted_path);
    });
  },
  addFieldSync: function(field_name){
    if(this.fields.indexOf(field_name) == -1){
      this.fields.push(field_name);
    } else {
      return;
    }

    var abs_path = path.join(this.base_path, this.model_name, field_name);
    var deleted_path = path.join(abs_path, "_deleted");

    fs.mkdirpSync(abs_path);
    fs.mkdirpSync(deleted_path);
  },
  softDelete: function(field, sequelize_instance){
    var dir_path = path.join(this.base_path, this.model_name, 
      field);

    return Promise.all(
      fs.readDirAsync(dir_path)

        .filter(function(filename, index, length){
          return path.parse(filename).name == sequelize_instance.id.toString();
        })

        .then(function(filtered){
          var full_path = path.join(this.base_path, this.model_name, field, 
            filtered);
          var deleted_path = path.join(this.base_path, this.model_name, field, 
            "_deleted", filtered); 

          return this.moveFile(full_path, deleted_path);    
        })
    );
  },
  store: function(field, abs_source_path, fname, ext_with_dot, copy_mode){
    var abs_dest = path.join(this.base_path, this.model_name, field, fname + ext_with_dot);

    if(copy_mode){
      return this.copyFile(abs_source_path, abs_dest)
      .then(function(){
        return abs_dest;  
      });
    } else {
      return this.moveFile(abs_source_path, abs_dest)
        .then(function(){
          return abs_dest;  
        });
    }
  },
  storeFromObject: function(file_object, copy_mode){
    /**
     * storeFromObject
     * @param {String} field
     * @param {IFileModel} file_object
     **/
    var field = file_object.object_field;
    var abs_source = file_object.path;
    var fname = file_object.getFilename();
    var abs_dest = path.join(
      this.base_path, this.model_name, 
      field, fname
    ); 

    if(copy_mode){

      return this.copyFile(abs_source, abs_dest)
        .then(function(){
          return abs_dest;  
        });

    } else {

      return this.moveFile(abs_source, abs_dest)
        .then(function(){
          return abs_dest;  
        });
      
    }
  },
  destroy: function(){
    return fs.removeAsync(path.join(this.base_path, this.model_name));
  },
  bindToModel: function(model){
    return model["archive"] = this;
  },
  calculateDestination: function(file_object){
    return path.join(
        this.base_path, this.model_name,
        file_object.object_field, file_object.getFilename()
      )
  }
};

module.exports = ArchiveManager;