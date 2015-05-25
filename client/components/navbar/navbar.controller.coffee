'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'NavbarCtrl', ($scope, $location, Auth, $translate) ->
  $scope.menu = [
    title: 'Home'
    link: '/'
  ]
  $scope.project = {
    name: "PFC Laminas"
  }
  $scope.isCollapsed = true
  $scope.isLoggedIn = Auth.isLoggedIn
  $scope.isAdmin = Auth.isAdmin
  $scope.getCurrentUser = Auth.getCurrentUser

  $scope.logout = ->
    Auth.logout()
    $location.path '/login'

  $scope.isActive = (route) ->
    route is $location.path()

  $scope.changeLanguage = (lang) ->
    $translate.use lang 