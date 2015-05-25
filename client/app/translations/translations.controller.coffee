'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'TranslationsCtrl', ($scope, $http, $translate, $translatePartialLoader) ->
  
  $translatePartialLoader.addPart "translations"
  $translate.refresh()

  $scope.gridOptions = {data: 'translationsTable'}

  $scope.alerts = [];

  $scope.closeAlert = (index) ->
    $scope.alerts.splice(index, 1) 

  $http.get("/api/translations1.json")
  	.success (data, status, headers, config) ->
  		$scope.translationsTable = data

  	.error (data, status, headers, config) ->
      $scope.translationsTable = {}

      $translate "WEB_SERVICE_CONNECTION_ERROR"
        .then (msg) ->
          $scope.alerts.push type:"danger", msg: msg

      

  

