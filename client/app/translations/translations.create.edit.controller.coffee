'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'TranslationsCreateEditCtrl', 
  ($scope, $rootScope, socket, $http, $translate, $translatePartialLoader, $state, $stateParams, notificationManager) ->

    ## sistema de traducciones
    $translatePartialLoader.addPart "translations"
    $translate.refresh()

    $translate(["NEW_MODEL_CREATED_OK", "NEW_MODEL_CREATED_FAIL", "MODEL_UPDATED_OK", "MODEL_UPDATED_FAIL"])
      .then (words) -> 
        $scope.created_ok = words.NEW_MODEL_CREATED_OK
        $scope.created_fail = words.NEW_MODEL_CREATED_FAIL
        $scope.updated_ok = words.MODEL_UPDATED_OK
        $scope.updated_fail = words.MODEL_UPDATED_FAIL

    # enviar el idioma actual al crear traducciones
    # a traves de un campo oculto
    $scope.currentLanguage = $translate.use()
    $rootScope.$on "$translateChangeSuccess", ->
      $scope.currentLanguage = $translate.use()

    ## FIN TRADUCCIONES

    ## BINDINGS MODELO
    if($stateParams.id == undefined)
      $scope.translation = {}
    else 
      $http.get("/api/translations/" + $stateParams.id)
        .success (data, status, headers, config) ->
          $scope.translation = data
        .error (data, status, headers, config) ->
          $scope.notif.addNotification type:"danger", msg: "WEB_SERVICE_CONNECTION_ERROR"
    ## FIN BINDINGS MODELO

    ## NOTIFICACIONES
    $scope.notif = notificationManager;
    $scope.notif.clear();
    ## FIN NOTIFICACIONES

    ## METODOS

    $scope.submit = () ->
      id = $scope.translation.id
      if(id == undefined)
        $http.post("/api/translations", $scope.translation)
          .success (data, status, headers, config) ->
            $scope.notif.addNotification type:"success", msg: $scope.created_ok
            $scope.translation = {} 
          .error (data, status, headers, config) ->
            $scope.notif.addNotification type:"danger", msg: $scope.created_fail
      else
        $http.put("/api/translations/" + id, $scope.translation)
          .success (data, status, headers, config) ->
            $scope.notif.addNotification type:"success", msg: $scope.updated_ok
          .error (data, status, headers, config) ->
            $scope.notif.addNotification type:"danger", msg: $scope.updated_fail
    
    ## FIN METODOS