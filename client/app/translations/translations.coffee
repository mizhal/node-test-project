'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'translations',
    url: '/translations'
    templateUrl: 'app/translations/translations.html'
    controller: 'TranslationsCtrl'
