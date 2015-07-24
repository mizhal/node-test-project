/**
  class ArchiveManager

**/

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs.extra'));
var path = require("path");
var mkdirp = require("mkdirp");

function ArchiveManager(base_path, model_name, field_names){
  this.model_name = model_name;
  this.base_path = path.join(process.env.PWD, base_path);
  this.field_names = field_names;
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
    var host = this;

    return Promise.all(
      this.field_names.map(function(field_name){

        var abs_path = path.join(host.base_path, host.model_name, field_name);
        var deleted_path = path.join(abs_path, "_deleted");

        return fs.mkdirpAsync(abs_path).then(function(){
          return fs.mkdirpAsync(deleted_path);
        });
      })
    );
  },
  softDelete: function(_field, _id, _ext){
    var base_path = process.env.PWD;
    var abs_path = path.join(this.base_path, this.model_name, _field, _id + "." + _ext);
    var deleted_path = path.join(this.base_path, this.model_name, _field, "_deleted", _id + "." + _ext);

    return this.moveFile(abs_path, deleted_path);
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
  storeFromObject: function(field, file_object){
    var abs_source = path.join(this.base_path, file_object.path);
    var fname = file_object.object_id.toString() + "." + file_object.extension;
    var abs_dest = path.join(
      this.base_path, this.model_name, 
      field, fname
    ); 

    return this.moveFile(abs_source, abs_dest)
      .then(function(){
        return abs_dest;  
      });
  },
  destroy: function(){
    return fs.removeAsync(this.base_path);
  }
};

module.exports = ArchiveManager;