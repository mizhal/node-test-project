'use strict';

var _ = require('lodash');
var Usuario = require('./Usuario.model');

// Get list of Usuarios
exports.index = function(req, res) {
  Usuario.find(function (err, Usuarios) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Usuarios);
  }); 
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
  Usuario.findById(req.params.id, function (err, Usuario) {
    if(err) { return handleError(res, err); }
    if(!Usuario) { return res.status(404).send('Not Found'); }
    return res.json(Usuario);
  });
};

// Creates a new Usuario in the DB.
exports.create = function(req, res) {
  var new_ = new Usuario(req.body);
  new_.save(function(err, Usuario) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Usuario);
  });
};

// Updates an existing Usuario in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Usuario.findById(req.params.id, function (err, Usuario) {
    if (err) { return handleError(res, err); }
    if(!Usuario) { return res.status(404).send('Not Found'); }
    var updated = _.merge(Usuario, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Usuario);
    });
  });
};

// Deletes a Usuario from the DB.
exports.destroy = function(req, res) {
  Usuario.findById(req.params.id, function (err, Usuario) {
    if(err) { return handleError(res, err); }
    if(!Usuario) { return res.status(404).send('Not Found'); }
    Usuario.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
 
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
  var new_ = Usuario.build(req.body);
  new_.save()
    .then(function(err, Usuario) {
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

function handleError(res, err) {
  return res.status(500).send(err);
}
