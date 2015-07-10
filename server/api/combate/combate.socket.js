/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var CombateFacade = require('./combate.model');

exports.register = function(socket) {

  /*Combate.afterCreate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Combate.afterUpdate(function(obj, options, fn){
    onSave(socket, obj);
    fn(null, obj);
  });

  Combate.afterDestroy(function(obj, options, fn){
    onRemove(socket, obj);
    fn(null, obj);
  });*/

}

function onSave(socket, doc, cb) {
  socket.emit('combate:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('combate:remove', doc);
}