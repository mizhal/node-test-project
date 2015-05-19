/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DatosProfesor = require('./DatosProfesor.model');

exports.register = function(socket) {
  DatosProfesor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DatosProfesor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('DatosProfesor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('DatosProfesor:remove', doc);
}