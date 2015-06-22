'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'EditorCtrl', ($scope) ->
  $scope.errors = [ ## no nos importan de momento los correctores de los errores
    {
      x: 100, 
      y: 100, 
      radius: 33,
      category: "XXXXX/YYYYY",
      status: "ERROR_CREATED"
    },
    {
      x: 100, 
      y: 100, 
      radius: 33,
      category: "XXXXX/YYYYY",
      status: "ERROR_CLAIMED"
    },
    {
      x: 100, 
      y: 100, 
      radius: 33,
      category: "XXXXX/YYYYY",
      status: "ERROR_CONFIRMED"
    }    
  ]