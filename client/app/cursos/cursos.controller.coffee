'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'CursosCtrl', ($scope) ->

  class Curso
    constructor: (@nombre, @anyo) ->

  $scope.courses = []