'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'TranslationsCtrl', ($scope, $rootScope, socket, $http, $translate, $translatePartialLoader, $state) ->
  
  $translatePartialLoader.addPart "translations"
  $translate.refresh()

  $scope.gridOptions = {data: 'translationsTable'}

  $scope.alerts = [];
  $scope.translationsTable = [];

  # enviar el idioma actual al crear traducciones
  # a traves de un campo oculto
  $scope.currentLanguage = $translate.use()
  $rootScope.$on "$translateChangeSuccess", ->
    $scope.currentLanguage = $translate.use()


  $scope.closeAlert = (index) ->
    $scope.alerts.splice(index, 1) 

  $scope.addNew = ->
    $state.go("new-translation")

  ## Carga de el listado principal de traducciones

  $http.get("/api/translations")
    .success (data, status, headers, config) ->
      socket.syncUpdates 'Translation', $scope.translationsTable
      $scope.translationsTable.push(element) for element in data

    .error (data, status, headers, config) ->
      $scope.translationsTable = {}

      $translate "WEB_SERVICE_CONNECTION_ERROR"
        .then (msg) ->
          $scope.alerts.push type:"danger", msg: msg

  $scope.$on '$destroy', ->
    socket.unsyncUpdates 'Translation'