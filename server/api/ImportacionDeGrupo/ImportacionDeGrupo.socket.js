/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ImportacionDeGrupo = require('./ImportacionDeGrupo.model');

exports.register = function(socket) {
  ImportacionDeGrupo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ImportacionDeGrupo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('ImportacionDeGrupo:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ImportacionDeGrupo:remove', doc);
}