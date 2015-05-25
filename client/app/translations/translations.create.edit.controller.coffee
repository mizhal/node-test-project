'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'TranslationsCreateEditCtrl', 
  ($scope, $rootScope, socket, $http, $translate, $translatePartialLoader, $state) ->

    ## sistema de traducciones
    $translatePartialLoader.addPart "translations"
    $translate.refresh()

    ## bindings del modelo
    $scope.translation = {}

    ## notificaciones
    $scope.alerts = [];

    $scope.submit = () ->
      $http.post("/api/translations", $scope.translation)
        .success (data, status, headers, config) ->
          $translate "NEW_MODEL_CREATED_OK"
            .then (msg) ->
              $scope.alerts.push type:"success", msg: msg
          $scope.translation = {} 
        .error (data, status, headers, config) ->
          $translate "NEW_MODEL_CREATED_FAIL"
            .then (msg) ->
              $scope.alerts.push type:"danger", msg: msg 