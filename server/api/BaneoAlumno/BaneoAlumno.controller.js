'use strict';

var _ = require('lodash');
var BaneoAlumno = require('./BaneoAlumno.model');

// Get list of BaneoAlumnos
exports.index = function(req, res) {
  BaneoAlumno.find(function (err, BaneoAlumnos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(BaneoAlumnos);
  });
};

// Get a single BaneoAlumno
exports.show = function(req, res) {
  BaneoAlumno.findById(req.params.id, function (err, BaneoAlumno) {
    if(err) { return handleError(res, err); }
    if(!BaneoAlumno) { return res.status(404).send('Not Found'); }
    return res.json(BaneoAlumno);
  });
};

// Creates a new BaneoAlumno in the DB.
exports.create = function(req, res) {
  var new_ = new BaneoAlumno(req.body);
  new_.save(function(err, BaneoAlumno) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(BaneoAlumno);
  });
};

// Updates an existing BaneoAlumno in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BaneoAlumno.findById(req.params.id, function (err, BaneoAlumno) {
    if (err) { return handleError(res, err); }
    if(!BaneoAlumno) { return res.status(404).send('Not Found'); }
    var updated = _.merge(BaneoAlumno, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(BaneoAlumno);
    });
  });
};

// Deletes a BaneoAlumno from the DB.
exports.destroy = function(req, res) {
  BaneoAlumno.findById(req.params.id, function (err, BaneoAlumno) {
    if(err) { return handleError(res, err); }
    if(!BaneoAlumno) { return res.status(404).send('Not Found'); }
    BaneoAlumno.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}