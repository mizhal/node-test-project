/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DatosAlumno = require('./DatosAlumno.model');

exports.register = function(socket) {
  DatosAlumno.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DatosAlumno.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('DatosAlumno:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('DatosAlumno:remove', doc);
}