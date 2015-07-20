'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'cursos',
    url: '/cursos'
    templateUrl: 'app/cursos/cursos.html'
    controller: 'CursosCtrl'
