/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Role = require('./Role.model');

exports.register = function(socket) {

  Role.afterCreate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Role.afterUpdate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Role.afterDestroy(function(obj, options, fn){
    onRemove(socket, obj);
    fn(null, obj);
  });

}

function onSave(socket, doc, cb) {
  socket.emit('Role:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Role:remove', doc);
}