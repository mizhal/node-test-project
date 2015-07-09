'use strict'

###
  Esta directiva emite los eventos
    "alcahest-error-create", con args = [x,y,radius]
    "alcahest-error-modified", con args = [error_id, new_x, new_y, new_radius]
###

angular.module 'pfcLaminasNodeApp'
.directive 'alcahestErrorAnnotable', (EditableCamera) ->
  restrict: 'EA'
  link: (scope, element, attrs) ->
    scope.editable_camera = EditableCamera
    scope.editable_camera.init(scope, element)


