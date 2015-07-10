'use strict'

angular.module 'pfcLaminasNodeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'pascalprecht.translate',
  'ui.grid',
  'angular-carousel'
]
.config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) ->
  $urlRouterProvider
  .otherwise '/'

  $locationProvider.html5Mode true
  $httpProvider.interceptors.push 'authInterceptor'

  $translatePartialLoaderProvider.addPart('main');
  $translateProvider.useLoader '$translatePartialLoader', {
    urlTemplate: "assets/i18n/{part}/{lang}.json"
  }
  $translateProvider.preferredLanguage("es")

.factory 'authInterceptor', ($rootScope, $q, $cookieStore, $location) ->
  # Add authorization token to headers
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = 'Bearer ' + $cookieStore.get 'token' if $cookieStore.get 'token'
    config

  # Intercept 401s and redirect you to login
  responseError: (response) ->
    if response.status is 401
      $location.path '/login'
      # remove any stale tokens
      $cookieStore.remove 'token'

    $q.reject response

.factory 'notificationManager', () ->
  notificationManagerInstance = {
    alerts: [],
    closeNotification: (index) -> 
      this.alerts.splice(index, 1)
    addNotification: (notif_data) ->
      this.alerts.push notif_data
    pending: () ->
      return this.alerts
    clear: () ->
      this.alerts.length = 0;
  }

  return notificationManagerInstance

.run ($rootScope, $location, Auth) ->
  # Redirect to login if route requires auth and you're not logged in
  $rootScope.$on '$stateChangeStart', (event, next) ->
    Auth.isLoggedInAsync (loggedIn) ->
      $location.path "/login" if next.authenticate and not loggedIn
