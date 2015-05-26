'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'TranslationsCtrl', ($scope, $rootScope, socket, $http, $translate, $translatePartialLoader, $state, notificationManager) ->
  
  ## TRADUCCIONES
  $translatePartialLoader.addPart "translations"
  $translate.refresh()
  $scope.translationsTable = [];
  ## FIN TRADUCCIONES

  ## CONFIGURACION TABLA
  $scope.gridOptions = {
    data: 'translationsTable',
    columnDefs: [
      {field: "key", name: "TRANSLATION.FIELD.KEY", headerCellFilter: "translate"},
      {field: "language", name: "TRANSLATION.FIELD.LANGUAGE", headerCellFilter: "translate"},
      {field: "view", name: "TRANSLATION.FIELD.VIEW", headerCellFilter: "translate"},
      {field: "value", name: "TRANSLATION.FIELD.VALUE", headerCellFilter: "translate"},
      {name: "TABLE_ACTIONS", headerCellFilter: "translate", cellTemplate: "<a translate='TABLE_EDIT' href='/translations/edit/{{row.entity._id}}' class='btn btn-info'></a>"}
    ]
  }
  ## FIN CONFIGURACION TABLA

  ## NOTIFICACIONES
  $scope.notif = notificationManager 
  ## FIN NOTIFICACIONES

  ## ACCIONES DE LA VISTA
  $scope.addNew = ->
    $state.go("new-translation")
  ## FIN ACCIONES DE LA VISTA

  ## PROVISION DE DATOS / SINCRONIZACION
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
  ## FIN PROVISION DE DATOS / SINCRONIZACION