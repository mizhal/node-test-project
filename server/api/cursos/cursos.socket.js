/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var CursosFacade = require('./cursos.model');

exports.register = function(socket) {

/*  Cursos.afterCreate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Cursos.afterUpdate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Cursos.afterDestroy(function(obj, options, fn){
    onRemove(socket, obj);
    fn(null, obj);
  });*/

}

function onSave(socket, doc, cb) {
  //socket.emit('cursos:save', doc);
}

function onRemove(socket, doc, cb) {
  //socket.emit('cursos:remove', doc);
}