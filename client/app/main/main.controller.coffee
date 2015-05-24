'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'MainCtrl', ($scope, $http, socket, $translate, $translatePartialLoader) ->

  $scope.awesomeThings = []

  $translatePartialLoader.addPart 'main'

  $http.get('/api/things').success (awesomeThings) ->
    $scope.awesomeThings = awesomeThings
    socket.syncUpdates 'thing', $scope.awesomeThings

  $scope.addThing = ->
    return if $scope.newThing is ''
    $http.post '/api/things',
      name: $scope.newThing

    $scope.newThing = ''

  $scope.deleteThing = (thing) ->
    $http.delete '/api/things/' + thing._id

  $scope.$on '$destroy', ->
    socket.unsyncUpdates 'thing'
