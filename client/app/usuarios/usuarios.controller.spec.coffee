'use strict'

describe 'Controller: UsuariosCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  UsuariosCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UsuariosCtrl = $controller 'UsuariosCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
