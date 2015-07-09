'use strict';

var _ = require('lodash');
var Combate = require('./combate.model');

// Deliverables
exports.deliverables = {};

Entrega = Combate.Entrega;

exports.deliverables.index = function(req, res) { 
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

    Entrega.findAll(query).then(function(combates){
      return res.status(200).json(combates);
    }).catch(function(err){
      return handleError(res, err);
    });
  
}; 
// Get a single combate
exports.deliverables.show = function(req, res) {
  Entrega.findById(req.params.id)
    .then(function (combate) {
      if(!combate) { return res.status(404).send('Not Found'); }
      return res.json(combate);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new combate in the DB.
exports.deliverables.create = function(req, res) {
  var new_ = Entrega.build(req.body);
  new_.save()
    .then(function(combate) {
      return res.status(201).json(combate);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing combate in the DB.
exports.deliverables.update = function(req, res) {
  Entrega.findById(req.params.id)
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
exports.deliverables.destroy = function(req, res) {
  Entrega.findById(req.params.id)
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
// FIN: Deliverables

// Error
exports.errors = {};

Error = Combate.Error;

exports.errors.index = function(req, res) { 
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

    Error.findAll(query).then(function(combates){
      return res.status(200).json(combates);
    }).catch(function(err){
      return handleError(res, err);
    });
  
}; 
// Get a single combate
exports.errors.show = function(req, res) {
  Error.findById(req.params.id)
    .then(function (combate) {
      if(!combate) { return res.status(404).send('Not Found'); }
      return res.json(combate);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new combate in the DB.
exports.errors.create = function(req, res) {
  var new_ = Error.build(req.body);
  new_.save()
    .then(function(combate) {
      return res.status(201).json(combate);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing combate in the DB.
exports.errors.update = function(req, res) {
  Error.findById(req.params.id)
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
exports.errors.destroy = function(req, res) {
  Error.findById(req.params.id)
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
// FIN: Error

function handleError(res, err) {
  return res.status(500).send(err);
}
