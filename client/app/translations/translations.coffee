'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider
    .state 'translations',
      url: '/translations'
      templateUrl: 'app/translations/translations.html'
      controller: 'TranslationsCtrl'
  $stateProvider
    .state "new-translation",
      url: "/translations/new"
      templateUrl: "app/translations/partials/new.html"
      controller: "TranslationsCreateEditCtrl"
