/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Usuario = require('./Usuario.model');

exports.register = function(socket) {

  Usuario.afterCreate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Usuario.afterUpdate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Usuario.afterDestroy(function(obj, options, fn){
    onRemove(socket, obj);
    fn(null, obj);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('Usuario:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Usuario:remove', doc);
}