/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var GrupoAlumnos = require('./GrupoAlumnos.model');

exports.register = function(socket) {
  GrupoAlumnos.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  GrupoAlumnos.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('GrupoAlumnos:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('GrupoAlumnos:remove', doc);
}