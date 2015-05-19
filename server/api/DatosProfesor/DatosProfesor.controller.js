'use strict';

var _ = require('lodash');
var DatosProfesor = require('./DatosProfesor.model');

// Get list of DatosProfesors
exports.index = function(req, res) {
  DatosProfesor.find(function (err, DatosProfesors) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(DatosProfesors);
  });
};

// Get a single DatosProfesor
exports.show = function(req, res) {
  DatosProfesor.findById(req.params.id, function (err, DatosProfesor) {
    if(err) { return handleError(res, err); }
    if(!DatosProfesor) { return res.status(404).send('Not Found'); }
    return res.json(DatosProfesor);
  });
};

// Creates a new DatosProfesor in the DB.
exports.create = function(req, res) {
  var new_ = new DatosProfesor(req.body);
  new_.save(function(err, DatosProfesor) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(DatosProfesor);
  });
};

// Updates an existing DatosProfesor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DatosProfesor.findById(req.params.id, function (err, DatosProfesor) {
    if (err) { return handleError(res, err); }
    if(!DatosProfesor) { return res.status(404).send('Not Found'); }
    var updated = _.merge(DatosProfesor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(DatosProfesor);
    });
  });
};

// Deletes a DatosProfesor from the DB.
exports.destroy = function(req, res) {
  DatosProfesor.findById(req.params.id, function (err, DatosProfesor) {
    if(err) { return handleError(res, err); }
    if(!DatosProfesor) { return res.status(404).send('Not Found'); }
    DatosProfesor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}