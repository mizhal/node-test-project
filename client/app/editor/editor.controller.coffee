'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'EditorCtrl', ($scope) ->
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

  ### CONEXION editableCamera -> errorRenderer ###
  $scope.$on "alcahest-error:commit", (event, error) ->
    console.log("Commited error data:", error)
  ### FIN: CONEXION editableCamera -> errorRenderer ###

  ### ESTADO DE BOTONES Y FEEDBACK DE LA GUI ###
  $scope.gui_state = {
    editing: false,
    edit_class: "inactive",

    toggleEdit: () ->
      if this.editing
        this.editing = false
        this.edit_class = "inactive"
      else
        this.editing = true
        this.edit_class = "active"
  }
  ### FIN: ESTADO DE BOTONES Y FEEDBACK DE LA GUI ###

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
    if $scope.gui_state.editing
      $scope.$emit("alcahest-error:deactivate-canvas")
      $scope.gui_state.toggleEdit()
    else
      $scope.$emit("alcahest-error:activate-canvas")  
      $scope.gui_state.toggleEdit()
  ## FIN: Alcahest-Pan