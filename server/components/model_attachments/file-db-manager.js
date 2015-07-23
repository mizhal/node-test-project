/** class FileDBManager 

  Se ocupa de gestionar la representacion de los archivos adjuntos en la 
  base de datos.
  
**/
var FileDBManager = {
  host: null,
  bindHost: function(instance){
    /**
      seleccion un objeto del ORM para trabajar el. 
    **/
    this.host = instance;
  },
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
    this.host["__temp_file_fields"] ||= {};
    this.host["__temp_file_fields"][field] = file_object;
  },
  deleteAllFilesAndFields: function(){
    /** () -> Promise **/
    return FileModel.delete({
      where: {
        object_id: instance.id
      }
    })
  },
  processAllTemporaryObjects: function(process_callback){
    for(var field in this.host["__temp_file_fields"]){
      process_callback(field, this.host["__temp_file_fields"][field]);
    }
  }
};

module.exports = FileDBManager;