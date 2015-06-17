'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'usuarios',
    url: '/usuarios'
    templateUrl: 'app/usuarios/usuarios.html'
    controller: 'UsuariosCtrl'
