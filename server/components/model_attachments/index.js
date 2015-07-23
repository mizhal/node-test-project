//model attachments: manages attached files to model fields.

var _ = require("lodash");
var fs = require('fs.extra');
var path = require("path");
var mkdirp = require("mkdirp");

/*** AUX FUNCTIONS ***/
function moveFile(source, destination){
	var fsSource = fs.createReadStream(source);
	var fsDestination = fs.createWriteStream(destination);
	fsSource.pipe(fsDestination);
	fs.unlinkSync(source);
}

function createArchive(archive_path, field_names){
	var base_path = process.env.PWD;
	for(var i = 0; i < field_names.length; i++){
		var field_name = field_names[i];

		var abs_path = path.join(base_path, archive_path, field_name);
		var deleted_path = path.join(abs_path, "_deleted");

		fs.mkdirpSync(abs_path);
		fs.mkdirpSync(deleted_path);
	}
}

function softDelete(archive_path, _field, _id, _ext){
	var base_path = process.env.PWD;
	var abs_path = path.join(base_path, archive_path, _field, _id + "." + _ext);
	var deleted_path = path.join(base_path, archive_path, _field, "_deleted", _id + "." + _ext);

	moveFile(abs_path, deleted_path);
}

function store(archive_path, field, source, fname, ext){
	var base_path = process.env.PWD;

	var abs_source = path.join(base_path, source);
	var abs_dest = path.join(base_path, archive_path, field, fname + "." + ext);

	moveFile(abs_source, abs_dest);
	return abs_dest;
}

/*** END: AUX FUNCTIONS ***/

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

	// utility methods
	Model.options.instanceMethods.attachFiles = function(req_files){
		for(var i = 0; i < field_names.length; i++){
			var field = field_names[i];
			var file_data = req_files[field];
			if(file_data == undefined){
				continue;
			}

			this["__temp_file_fields"] ||= {}
			this["__temp_file_fields"][field] = FileModel.build({
				model: Model,
				field: field,
				object_id: this.id,
				path: file_data.path,
				mimetype: file_data.mimetype,
				extension: file_data.extension,
				original_filename: file_data.originalname
			});
		}
	}

	Model.hook("beforeSave", function(instance){
		for(var i = 0; i < field_names.length; i++){
			var field = field_names[i];
			this["__temp_file_fields"][field]
				.save()
				.then(function(file_instance){
					this[field + "Id"] = file_instance.id;
				})
				.catch(function(error){
					morgan.
				});
		}
	});

}




}