'use strict';

var _ = require('lodash');
var Translation = require('./Translation.model');

// Get list of Translations
exports.index = function(req, res) {
  var page_size = 100
  var page_offset = (req.params.page || 0) * page_size;
  var language = req.query.lang;
  var query = {};
  if(req.query.filter){
    query = {key: new RegExp("^.*" + req.query.filter + ".*$", "i")};
  }
  Translation.find(query, "key language view value", 
    {skip: page_offset, limit: page_size},
    function (err, Translations) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(Translations);
    }
  );
};

// Get a single Translation
exports.show = function(req, res) {
  Translation.findById(req.params.id, function (err, Translation) {
    if(err) { return handleError(res, err); }
    if(!Translation) { return res.status(404).send('Not Found'); }
    return res.json(Translation);
  });
};

// Creates a new Translation in the DB.
exports.create = function(req, res) {
  var new_ = new Translation(req.body);
  new_.save(function(err, Translation) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Translation);
  });
};

// Updates an existing Translation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Translation.findById(req.params.id, function (err, Translation) {
    if (err) { return handleError(res, err); }
    if(!Translation) { return res.status(404).send('Not Found'); }
    var updated = _.merge(Translation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Translation);
    });
  });
};

// Deletes a Translation from the DB.
exports.destroy = function(req, res) {
  Translation.findById(req.params.id, function (err, Translation) {
    if(err) { return handleError(res, err); }
    if(!Translation) { return res.status(404).send('Not Found'); }
    Translation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}