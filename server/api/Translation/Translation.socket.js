/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Translation = require('./Translation.model');

exports.register = function(socket) {
  Translation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Translation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('Translation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Translation:remove', doc);
}