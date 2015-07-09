'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider.state 'editor',
    url: '/editor/:deliverable_id'
    templateUrl: 'app/editor/editor.html'
    controller: 'EditorCtrl'
