'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'MainCtrl', ($scope, $http, socket, $translate, $translatePartialLoader) ->

  $scope.awesomeThings = []

  $translatePartialLoader.addPart 'main'
  $translate.refresh()


  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac dapibus ex. Etiam pellentesque nibh tellus, non bibendum justo eleifend lacinia. Etiam non ultrices nibh, sed accumsan nisi. Nulla porttitor lacus ac congue ullamcorper. Mauris felis purus, ultrices eget leo sed, lobortis venenatis nulla. In sodales cursus mauris, vel rhoncus sapien sagittis a. Nam aliquet nisl vitae elementum fermentum. Morbi ligula nibh, dignissim id tincidunt et, ornare sed velit. Quisque rutrum metus id neque ultrices sodales. Maecenas id ligula dapibus, elementum nulla et, hendrerit lectus. Curabitur dolor neque, fringilla ac malesuada placerat, placerat at enim. Aenean ut euismod augue. Phasellus sit amet commodo massa.\nMaecenas lobortis nisl eu lacus posuere hendrerit. Nunc venenatis efficitur viverra. Duis pharetra, purus ut condimentum luctus, dui purus bibendum diam, et ornare est nibh et nisi. Praesent sed porttitor urna. Donec nunc purus, ultrices vitae ullamcorper et, convallis nec sapien. Morbi id tristique tellus. Praesent a tempus orci, ac rutrum magna. Nullam gravida, quam quis efficitur ullamcorper, odio odio feugiat odio, vel faucibus sapien felis tincidunt risus. Nullam arcu augue, semper a vulputate quis, hendrerit vitae tortor. Sed venenatis nulla quis lacus volutpat, et mattis sem tincidunt. Pellentesque ullamcorper turpis a eros varius semper. Sed sollicitudin ultricies laoreet. Mauris quis consequat massa. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\nCras vitae pulvinar arcu. Etiam eu elit iaculis, semper ex sed, ultrices neque. Praesent nisl nibh, tincidunt id mi eget, lobortis dignissim lectus. Nunc quis tellus volutpat, tempus sem quis, egestas elit. Mauris fermentum nunc ut libero venenatis pharetra. Morbi congue risus quam, sed blandit eros luctus at. Nulla ac mauris iaculis, imperdiet sapien vel, molestie velit. Duis finibus diam ut leo luctus pulvinar.\nFusce efficitur elit sit amet augue luctus, eu sollicitudin ipsum efficitur. Maecenas eu velit feugiat, maximus sapien quis, aliquam est. Phasellus blandit est in nisl semper, at fringilla odio aliquet. Maecenas a nisi pharetra, maximus tortor vel, commodo magna. Proin venenatis sit amet dolor vitae elementum. Sed quis lorem et est vestibulum viverra at sed mi. Suspendisse a metus nibh. Maecenas pretium lacus condimentum, rutrum risus sed, viverra dolor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas quis sagittis lorem. Donec nisl sem, aliquet a lorem sit amet, dapibus iaculis lectus."

  ## imagenes del carrusel
  $scope.slides = [
    {url: "assets/images/carousel1.png", title: "Slide1", text: text},
    {url: "assets/images/carousel2.png", title: "Slide2", text: text},
    {url: "assets/images/carousel3.png", title: "Slide3", text: text}
  ]

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
