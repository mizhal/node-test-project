'use strict';

var _ = require('lodash');
var DatosAlumno = require('./DatosAlumno.model');

// Get list of DatosAlumnos
exports.index = function(req, res) {
  DatosAlumno.find(function (err, DatosAlumnos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(DatosAlumnos);
  });
};

// Get a single DatosAlumno
exports.show = function(req, res) {
  DatosAlumno.findById(req.params.id, function (err, DatosAlumno) {
    if(err) { return handleError(res, err); }
    if(!DatosAlumno) { return res.status(404).send('Not Found'); }
    return res.json(DatosAlumno);
  });
};

// Creates a new DatosAlumno in the DB.
exports.create = function(req, res) {
  var new_ = new DatosAlumno(req.body);
  new_.save(function(err, DatosAlumno) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(DatosAlumno);
  });
};

// Updates an existing DatosAlumno in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DatosAlumno.findById(req.params.id, function (err, DatosAlumno) {
    if (err) { return handleError(res, err); }
    if(!DatosAlumno) { return res.status(404).send('Not Found'); }
    var updated = _.merge(DatosAlumno, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(DatosAlumno);
    });
  });
};

// Deletes a DatosAlumno from the DB.
exports.destroy = function(req, res) {
  DatosAlumno.findById(req.params.id, function (err, DatosAlumno) {
    if(err) { return handleError(res, err); }
    if(!DatosAlumno) { return res.status(404).send('Not Found'); }
    DatosAlumno.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}