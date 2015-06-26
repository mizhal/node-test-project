'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'EditorCtrl', ($scope) ->
  $scope.editing = false

  ## ERRORES
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
  ## FIN: ERRORES

  ## Alcahest-Pan
  $scope.pan_left = (event) ->
    $scope.$emit("alcahest:pan-left")

  $scope.pan_up = (event) ->
    $scope.$emit("alcahest:pan-up")

  $scope.pan_right = (event) ->
    $scope.$emit("alcahest:pan-right")

  $scope.pan_down = (event) ->
    $scope.$emit("alcahest:pan-down")

  $scope.zoom_minus = (event) ->
    $scope.$emit("alcahest:zoom-minus")

  $scope.zoom_plus = (event) ->
    $scope.$emit("alcahest:zoom-plus") 

  $scope.activate_error_editor = () ->
    if $scope.editing
      $scope.$emit("alcahest-error:deactivate-canvas")
      $scope.editing = false
    else
      $scope.$emit("alcahest-error:activate-canvas")  
      $scope.editing = true
  ## FIN: Alcahest-Pan