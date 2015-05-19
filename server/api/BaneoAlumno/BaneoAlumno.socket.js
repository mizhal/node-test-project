/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BaneoAlumno = require('./BaneoAlumno.model');

exports.register = function(socket) {
  BaneoAlumno.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BaneoAlumno.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('BaneoAlumno:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('BaneoAlumno:remove', doc);
}