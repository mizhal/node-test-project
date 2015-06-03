'use strict';

var _ = require('lodash');
var Usuario = require("./Usuario.model.js");

// Get list of Usuarios
exports.index = function(req, res) { 
    var page_size = 100
    var page_offset = (req.params.page || 0) * page_size;
    var language = req.query.lang;
    var query = {
      offset: page_offset,
      limit: page_size
    };

    if(req.query.filter){
      query.where = {key: new RegExp("^.*" + req.query.filter + ".*$", "i")};
    }

    Usuario.findAll(query).then(function(Usuarios){
      return res.status(200).json(Usuarios);
    }).catch(function(err){
      return handleError(res, err);
    });
  
}; 
// Get a single Usuario
exports.show = function(req, res) {
  Usuario.findById(req.params.id)
    .then(function (Usuario) {
      if(!Usuario) { return res.status(404).send('Not Found'); }
      return res.json(Usuario);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new Usuario in the DB.
exports.create = function(req, res) {
  var new_ = Usuario.create(req.body)
    .then(function(Usuario) {
      return res.status(201).json(Usuario);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing Usuario in the DB.
exports.update = function(req, res) {
  Usuario.findById(req.params.id)
    .then(function (Usuario) {

      if(!Usuario) { 
        return res.status(404).send('Not Found'); 
      }

      var updated = _.merge(Usuario, req.body);
      updated.save()
        .then(function (err) {
          return res.status(200).json(Usuario);
        })
        .catch(function(err){
          return handleError(res, err);
        });

    }).catch(function(err){
      return handleError(res, err);
    });
};

// Deletes a Usuario from the DB.
exports.destroy = function(req, res) {
  Usuario.findById(req.params.id)
    .then(function (Usuario) {

      if(!Usuario) { 
        return res.status(404).send('Not Found'); 
      }

      Usuario.destroy()
        .then(function(err) {
          return res.status(204).send('No Content');
        })
        .catch(function(err){
          return handleError(res, err);
        });

    })
    .catch(function(err){
      return handleError(res, err);
    });
};

exports.me = function(req, res) {
  if(req.user) {
    var user = req.user;
    return res.json({
      "login": user.login,
      "ultimo_acceso": user.ultimo_acceso,
      "puede_entrar": user.puede_entrar,
      "role": "user"
    });
  } else {
    return res.status(404).send("Not Found");
  }
}

function handleError(res, err) {
  return res.status(500).send(err);
}
