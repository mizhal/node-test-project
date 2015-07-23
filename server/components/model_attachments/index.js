//model attachments: manages attached files to model fields.

var _ = require("lodash");
var logger = require("../logger");

var FileDBManager = require("./file-db-manager");
var ArchiveManager = require("./archive-manager");

module.exports = exports = function attachPlugin(schema, options){
	
	// create field columns for attachments
	var field_names = options.field_names;

	sc_options = {};
	for(var i=0; i < field_names.length; i++){
		sc_options[field_names[i]] = String;
		sc_options[field_names[i] + "_mimetype"] = String;
		sc_options[field_names[i] + "_original_fname"] = String;
		sc_options[field_names[i] + "_ext"] = String;
	}
	schema.add(sc_options);

	//set archive storage path
	var archive_path = options.path;
	createArchive(archive_path, field_names);

	schema.methods["attach"] = function(req_files){
		for(var i = 0; i < field_names.length; i++){
			var field = field_names[i];
			var file_data = req_files[field];
			if(file_data == undefined){
				continue;
			}

			this[field] = file_data.path
			this[field + "_mimetype"] = file_data.mimetype; 
			this[field + "_ext"] = file_data.extension;
			this[field + "_original_fname"] = file_data.originalname;
		}
	};

	schema.methods["resetAttachmentsArchive"] = function(callback){
		fs.rmrf(archive_path, function(){
			console.log("Attachment Archive in " + archive_path +  " DELETED");
			createArchive(archive_path, field_names);
			if(callback){
				callback();
			}	
		});		
	};

	schema.post("save", function(doc){
		for(var i = 0; i < field_names.length; i++){
			var field = field_names[i];
			if(doc[field]){
				var final_path = store(archive_path, field, doc[field], 
					doc._id.toString(), doc[field + "_ext"]);
				doc[field] = final_path;
			} 
		}
	});

	schema.post("remove", function(doc){
		for(var i = 0; i < field_names.length; i++){
			var field = field_names[i];
			if(doc[field]){
				softDelete(archive_path, field, doc.id, doc[field + "_ext"]);
			}
		}
	})

}


/** SEQUELIZE PLUGIN **/
function enableAttachments(Model, field_names, FileModel){

	var archive = new ArchiveManager(Model, field_names);

	// utility methods
	Model.options.instanceMethods.attachFiles = function(req_files){

		FileDBManager.bindHost(this);

		FileDBManager.eachFieldWithFile(field_names, req_files, function(file){

			var tmp_file_model = FileModel.build({
					model: Model,
					field: field,
					path: file_data.path,
					mimetype: file_data.mimetype,
					extension: file_data.extension,
					original_filename: file_data.originalname
				});

			FileDBManager.storeTemporarily(field, tmp_file_model);

		});
	}

	var update_files = function(instance){

		FileDBManager.bindHost(instance);

		FileDBManager.deleteAllFilesAndFields().then(function(){
			FileDBManager.processAllTemporaryObjects(function(field, tmp_object){

				// asignacion de los valores que faltan, id del objeto
				// y destino definitivo del archivo adjunto.
				tmp_object.object_id = instance.id;
				file_instance.path = archive.storeFromObject(field, file_instance);

				tmp_object.save()
					.then(function(file_instance){

						instance[field + "Id"] = file_instance.id;
						
					})
					.catch(function(error){
						logger.error(
							"%s.%s: Error saving attached file registry in database",
							Model, field
						);
					});

			});

		});
	};

	Model.hook("afterCreate", "model-attachments", update_files);
	Model.hook("afterUpdate", "model-attachments", update_files);

	Model.hook("afterDestroy", "model-attachments", function(instance){
		FileDBManager.bindHost(instance);
		FileDBManager.deleteAllFilesAndFields();
	});
}




}