'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'dashboard',
    url: '/dashboard'
    templateUrl: 'app/dashboard/dashboard.html'
    controller: 'DashboardCtrl'
