'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'editor',
    url: '/editor'
    templateUrl: 'app/editor/editor.html'
    controller: 'EditorCtrl'
