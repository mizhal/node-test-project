'use strict'

describe 'Controller: EditorCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  EditorCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    EditorCtrl = $controller 'EditorCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
