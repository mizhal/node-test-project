'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'CursosCtrl', ($scope) ->

  class Curso
    constructor: (@nombre, @anyo) ->

  $scope.courses = [
    new Curso("3º Grupo A", 2015),
    new Curso("3º Grupo B", 2015),
    new Curso("3º Grupo C", 2015)
  ];
