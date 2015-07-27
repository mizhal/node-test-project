/** class FileDBManager 

  Se ocupa de gestionar la representacion de los archivos adjuntos en la 
  base de datos.

  interface ISequelizeInstance {
    public ISequelizeModel Model;
  }
  
**/
function FileDBManager(host){
  /**
    @param {ISequelizeInstance} host
  
  **/
  this.host = host;
  this.model = host.Model;
}

FileDBManager.prototype = {
  eachFieldWithFile: function(field_names, req_files, each_callback){
    for(var i = 0; i < field_names.length; i++){
      var field = field_names[i];
      var file_data = req_files[field];
      if(file_data == undefined){
        continue;
      } else {
        each_callback([field, file_data]);
      }
    }
  },
  storeTemporarily: function(field, file_object){
    this.host["__temp_file_fields"] = this.host["__temp_file_fields"] || {};
    this.host["__temp_file_fields"][field] = file_object;
  },
  deleteAllFilesAndFields: function(){
    /** () -> Promise **/
    return FileModel.delete({
      where: {
        object_id: instance.id
      }
    });
  },
  processAllTemporaryObjects: function(process_callback){
    for(var field in this.host["__temp_file_fields"]){
      process_callback(field, this.host["__temp_file_fields"][field]);
    }
  },
  commitTemporaries: function(){
    /** () -> Promise **/
    var temps = this.host["__temp_file_fields"];
    if(temps){
      var fields = temps.keys();
      var db_manager = this;
      return Promise.all(
        fields.map(function(field){
          var temp_record = temps[field];
          return temp_record
            .save()
            .catch(function(error){
              logger.error("Error saving attachment for field '%s' and model '%s'",
                field, db_manager.host
              );
            });
        })
      );
    } else {
      return Promise.resolve();
    };
  },
  getArchiveFromModel: function(model) {
    /**
      @param {ISequelizeModel} model
    **/
    return model["archive"];
  },
  softDeleteAttachments: function(){
    var archive = this.getArchiveFromModel(this.Model);
    var fields = archive.getFields();

    var db_man = this;

    return Promise.all(
      fields.map(function(field){
        return archive.softDelete(field, db_man.host)
      })
    );
  } // softDeleteAttachments
};

module.exports = FileDBManager;