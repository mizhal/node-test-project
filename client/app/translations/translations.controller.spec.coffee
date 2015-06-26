'use strict'

describe 'Controller: TranslationsCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  TranslationsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    TranslationsCtrl = $controller 'TranslationsCtrl',
      $scope: scope,
      socket: {
        syncUpdates: ->
        unsyncUpdates: ->
      }

  it 'should ...', ->
    expect(1).toEqual 1
