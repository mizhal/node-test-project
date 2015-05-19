'use strict';

var _ = require('lodash');
var ImportacionDeGrupo = require('./ImportacionDeGrupo.model');

// Get list of ImportacionDeGrupos
exports.index = function(req, res) {
  ImportacionDeGrupo.find(function (err, ImportacionDeGrupos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(ImportacionDeGrupos);
  });
};

// Get a single ImportacionDeGrupo
exports.show = function(req, res) {
  ImportacionDeGrupo.findById(req.params.id, function (err, ImportacionDeGrupo) {
    if(err) { return handleError(res, err); }
    if(!ImportacionDeGrupo) { return res.status(404).send('Not Found'); }
    return res.json(ImportacionDeGrupo);
  });
};

// Creates a new ImportacionDeGrupo in the DB.
exports.create = function(req, res) {
  var new_ = new ImportacionDeGrupo(req.body);
  new_.save(function(err, ImportacionDeGrupo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(ImportacionDeGrupo);
  });
};

// Updates an existing ImportacionDeGrupo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ImportacionDeGrupo.findById(req.params.id, function (err, ImportacionDeGrupo) {
    if (err) { return handleError(res, err); }
    if(!ImportacionDeGrupo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(ImportacionDeGrupo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ImportacionDeGrupo);
    });
  });
};

// Deletes a ImportacionDeGrupo from the DB.
exports.destroy = function(req, res) {
  ImportacionDeGrupo.findById(req.params.id, function (err, ImportacionDeGrupo) {
    if(err) { return handleError(res, err); }
    if(!ImportacionDeGrupo) { return res.status(404).send('Not Found'); }
    ImportacionDeGrupo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}