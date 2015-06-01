/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Translation = require('./Translation.model');

exports.register = function(socket) {
  Translation.afterCreate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Translation.afterUpdate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Translation.afterDestroy(function(obj, options, fn){
    onRemove(socket, obj);
    fn(null, obj);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('Translation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Translation:remove', doc);
}