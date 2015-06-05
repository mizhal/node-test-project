'use strict';

var _ = require('lodash');
var Role = require('./Role.model');

// Get list of Roles
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

    Role.findAll(query).then(function(Roles){
      return res.status(200).json(Roles);
    }).catch(function(err){
      return handleError(res, err);
    });
  
}; 
// Get a single Role
exports.show = function(req, res) {
  Role.findById(req.params.id)
    .then(function (Role) {
      if(!Role) { return res.status(404).send('Not Found'); }
      return res.json(Role);
    }).catch(function(error){
      return handleError(res, error); 
    });
};

// Creates a new Role in the DB.
exports.create = function(req, res) {
  var new_ = Role.create(req.body)
    .then(function(Role) {
      return res.status(201).json(Role);
    }).catch(function(error){
      return handleError(res, error);
    });
};

// Updates an existing Role in the DB.
exports.update = function(req, res) {
  Role.findById(req.params.id)
    .then(function (Role) {

      if(!Role) { 
        return res.status(404).send('Not Found'); 
      }

      var updated = _.merge(Role, req.body);
      updated.save()
        .then(function (err) {
          return res.status(200).json(Role);
        })
        .catch(function(err){
          return handleError(res, err);
        });

    }).catch(function(err){
      return handleError(res, err);
    });
};

// Deletes a Role from the DB.
exports.destroy = function(req, res) {
  Role.findById(req.params.id)
    .then(function (Role) {

      if(!Role) { 
        return res.status(404).send('Not Found'); 
      }

      Role.destroy()
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
