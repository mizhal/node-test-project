'use strict';

var _ = require('lodash');
var paginate = require('node-paginate-anything');

var Cursos = require('./cursos.model');
var Curso = Cursos.Curso;
var DatosAlumno = Cursos.DatosAlumno;
var DatosProfesor = Cursos.DatosProfesor;

// Get list of cursos
exports.index = function(req, res) { 
  var total_items = Curso.count();
  
  var queryParameters = paginate(req, res, 
    total_items, 500);

  var language = req.query.lang;
  var query = {
    offset: queryParameters.skip,
    limit: queryParameters.limit
  };

  if(req.query.filter){
    query.where = {key: new RegExp("^.*" + req.query.filter + ".*$", "i")};
  }

  Curso.findAll(query).then(function(cursos){
    return res.status(200).json(cursos);
  }).catch(function(err){
    return handleError(res, err);
  });
}; 
// Get a single cursos
exports.show = function(req, res) {
  Cursos.findById(req.params.id)
    .then(function (cursos) {
      if(!cursos) { return res.status(404).send('Not Found'); }
      return res.json(cursos);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new cursos in the DB.
exports.create = function(req, res) {
  var new_ = Cursos.build(req.body);
  new_.save()
    .then(function(cursos) {
      return res.status(201).json(cursos);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing cursos in the DB.
exports.update = function(req, res) {
  Cursos.findById(req.params.id)
    .then(function (cursos) {

      if(!cursos) { 
        return res.status(404).send('Not Found'); 
      }

      var updated = _.merge(cursos, req.body);
      updated.save()
        .then(function (err) {
          return res.status(200).json(cursos);
        })
        .catch(function(err){
          return handleError(res, err);
        });

    }).catch(function(err){
      return handleError(res, err);
    });
};

// Deletes a cursos from the DB.
exports.destroy = function(req, res) {
  Cursos.findById(req.params.id)
    .then(function (cursos) {

      if(!cursos) { 
        return res.status(404).send('Not Found'); 
      }

      cursos.destroy()
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
