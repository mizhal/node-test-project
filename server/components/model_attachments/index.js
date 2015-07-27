//model attachments: manages attached files to model fields.

var _ = require("lodash");

var logger_module /* :ILoggerModule */= require("../logger");
var logger /* :ILogger */ = logger_module.getLogger();

var FileDBManager = require("./file-db-manager");
var ArchiveManager = require("./archive-manager");

/** conforms IModelAttachments */
module.exports = exports = {

	settings: {
		base_path: "/archive"
	},

	setSettings: function(settings){
		/**
			@param {Hash} _settings 
		 **/
		this.settings = _.assign(this.settings, settings);
	},

	enableAttachments: function(HostModel, FileModel) {
		/** 
			creates associated archive object for managing files in disk

			@param {ISequelizeModel} HostModel
			@param {ISequelizeModel} FileModel
		**/
		var base_path = this.settings.base_path;
		var archive = new ArchiveManager(base_path, HostModel.getTableName());
		archive.bindToModel(HostModel);

		try {
			archive.createSync();
		} catch (e) {
			logger.fatal("Cannot create attachment archive for model with tablename '%s'", 
				HostModel.getTableName());
		}

		this.bindAttachData(HostModel);
		this.bindAttachMethod(HostModel);
		this.bindCallbacks(HostModel);
	},

	defineAttachment: function(Model, field) {
		/**
			@param {ISequelizeModel} Model
			@param {String} field 
		**/
		var attachments = Model["__attachment_fields"]; 
		attachments[field] = {exists: 1, payload: null};

		var archive = Model["archive"];
		if(!archive){
			throw "You must call 'enableAttachments' on the model before trying to define a field";
		} else {
			try {
				archive.addFieldSync(field);
			} catch (e) {
				logger.fatal("Cannot create attachment field '%s' for model '%s'", 
					field, Model.name);
			}
		}
	},

	// private
	bindAttachData: function(Model) {
		/**
			@param {ISequelizeModel} Model
		**/
		Model["__attachment_fields"] = {};
	},

	bindAttachMethod: function(Model) {
		/** 
			creates method "attachFiles" to set attachments 
			
			@param {ISequelizeModel} Model
		**/

		Model.options.instanceMethods.attachFiles = function(req_files){
			/** 
				@param {IMulterFiles} req_files
			**/
			var attachments = Model["__attachment_fields"]; 
			var field_names = attachments.keys();

			for(index in field_names) {
				var field = field_names[index];
				var capitalized_field = _.capitalize(field);

				// crear un registro temporal en memoria que luego ira a la 
				// base de datos si todo valida bien.
				var fileman = new FileDBManager(this);

				fileman.eachFieldWithFile( field_names, req_files, 
					function(file, field){
						var tmp_file_model = FileModel.build({
								model: Model,
								field: field,
								path: file_data.path,
								mimetype: file_data.mimetype,
								extension: file_data.extension,
								original_filename: file_data.originalname
							});

						fileman.storeTemporarily(field, tmp_file_model);
				});
			}
		} // Model.options.instanceMethods.attachFiles
	}, // bindAttachMethod

	bindCallbacks: function(Model) {
		/**
			@param {ISequelizeModel} Model
		**/
		var store_attachments_callback = function(instance){
			var fileman = new FileDBManager(instance);
			fileman.commitTemporaries();
		};

		var delete_attachments_callback = function(instance){
			var fileman = new FileDBManager(instance);
			fileman.softDeleteAttachments();
		}

		Model.hook("afterCreate", "model-attachments", 
			store_attachments_callback);
		Model.hook("afterUpdate", "model-attachments", 
			store_attachments_callback);
		Model.hook("afterDestroy", "model-attachments", 
			delete_attachments_callback);
	} // bindCallbacks 

} // module.exports