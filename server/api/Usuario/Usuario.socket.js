/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var UsuarioFacade = require('./Usuario.model');
var Usuario = UsuarioFacade.Usuario;
var Role = UsuarioFacade.Role;

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
  socket.emit('Usuario:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Usuario:remove', doc);
}