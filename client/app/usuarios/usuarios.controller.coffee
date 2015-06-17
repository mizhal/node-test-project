'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'UsuariosCtrl', ($scope, Usuario, Role) ->
  $scope.usuariosAPI = Usuario.query()

  $scope.usersGridOptions = {
    enableFiltering: true,
    useExternalFiltering: true,
    data: "usuariosAPI"
  }

  $scope.rolesAPI = Role.query()

  $scope.rolesGridOptions = {
    enableFiltering: true,
    useExternalFiltering: true,
    data: "rolesAPI"
  }