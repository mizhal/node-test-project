'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'translations',
  	url: "/translations",
    template: '<h1>TEST TRANSLATIONS</h1>'
