'use strict';

var _ = require('lodash');
var GrupoAlumnos = require('./GrupoAlumnos.model');

// Get list of GrupoAlumnoss
exports.index = function(req, res) {
  GrupoAlumnos.find(function (err, GrupoAlumnoss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(GrupoAlumnoss);
  });
};

// Get a single GrupoAlumnos
exports.show = function(req, res) {
  GrupoAlumnos.findById(req.params.id, function (err, GrupoAlumnos) {
    if(err) { return handleError(res, err); }
    if(!GrupoAlumnos) { return res.status(404).send('Not Found'); }
    return res.json(GrupoAlumnos);
  });
};

// Creates a new GrupoAlumnos in the DB.
exports.create = function(req, res) {
  var new_ = new GrupoAlumnos(req.body);
  new_.save(function(err, GrupoAlumnos) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(GrupoAlumnos);
  });
};

// Updates an existing GrupoAlumnos in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  GrupoAlumnos.findById(req.params.id, function (err, GrupoAlumnos) {
    if (err) { return handleError(res, err); }
    if(!GrupoAlumnos) { return res.status(404).send('Not Found'); }
    var updated = _.merge(GrupoAlumnos, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(GrupoAlumnos);
    });
  });
};

// Deletes a GrupoAlumnos from the DB.
exports.destroy = function(req, res) {
  GrupoAlumnos.findById(req.params.id, function (err, GrupoAlumnos) {
    if(err) { return handleError(res, err); }
    if(!GrupoAlumnos) { return res.status(404).send('Not Found'); }
    GrupoAlumnos.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}