'use strict';

var _ = require('lodash');
var Combate = require('./combate.model');

// Get list of combates
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

    Combate.findAll(query).then(function(combates){
      return res.status(200).json(combates);
    }).catch(function(err){
      return handleError(res, err);
    });
  
}; 
// Get a single combate
exports.show = function(req, res) {
  Combate.findById(req.params.id)
    .then(function (combate) {
      if(!combate) { return res.status(404).send('Not Found'); }
      return res.json(combate);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new combate in the DB.
exports.create = function(req, res) {
  var new_ = Combate.build(req.body);
  new_.save()
    .then(function(combate) {
      return res.status(201).json(combate);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing combate in the DB.
exports.update = function(req, res) {
  Combate.findById(req.params.id)
    .then(function (combate) {

      if(!combate) { 
        return res.status(404).send('Not Found'); 
      }

      var updated = _.merge(combate, req.body);
      updated.save()
        .then(function (err) {
          return res.status(200).json(combate);
        })
        .catch(function(err){
          return handleError(res, err);
        });

    }).catch(function(err){
      return handleError(res, err);
    });
};

// Deletes a combate from the DB.
exports.destroy = function(req, res) {
  Combate.findById(req.params.id)
    .then(function (combate) {

      if(!combate) { 
        return res.status(404).send('Not Found'); 
      }

      combate.destroy()
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
