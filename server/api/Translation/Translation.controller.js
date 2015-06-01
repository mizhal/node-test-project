'use strict';

var _ = require('lodash');
var Translation = require('./Translation.model');

// Get list of Translations
exports.index = function(req, res) {
  var page_size = 100
  var page_offset = (req.params.page || 0) * page_size;
  var language = req.query.lang;
  var query = {
    attributes: ["id", "key", "language", "view", "value"],
    offset: page_offset,
    limit: page_size
  };

  if(req.query.filter){
    query.where = {key: new RegExp("^.*" + req.query.filter + ".*$", "i")};
  }

  Translation.findAll(query).then(function(translations){
    return res.status(200).json(translations);
  }).catch(function(err){
    return handleError(res, err);
  });

};

// Get a single Translation
exports.show = function(req, res) {
  Translation.findById(req.params.id)
    .then(function (Translation) {
      if(!Translation) { return res.status(404).send('Not Found'); }
      return res.json(Translation);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new Translation in the DB.
exports.create = function(req, res) {
  var new_ = Translation.build(req.body);
  new_.save()
    .then(function(err, Translation) {
      return res.status(201).json(Translation);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing Translation in the DB.
exports.update = function(req, res) {
  Translation.findById(req.params.id)
    .then(function (Translation) {

      if(!Translation) { 
        return res.status(404).send('Not Found'); 
      }

      var updated = _.merge(Translation, req.body);
      updated.save()
        .then(function (err) {
          return res.status(200).json(Translation);
        })
        .catch(function(err){
          return handleError(res, err);
        });

    }).catch(function(err){
      return handleError(res, err);
    });
};

// Deletes a Translation from the DB.
exports.destroy = function(req, res) {
  Translation.findById(req.params.id)
    .then(function (translation) {

      if(!translation) { 
        return res.status(404).send('Not Found'); 
      }

      translation.destroy()
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