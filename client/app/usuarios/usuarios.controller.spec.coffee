'use strict'

describe 'Controller: UsuariosCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  UsuariosCtrl = undefined
  scope = undefined
  $httpBackend = undefined
  mocked_responses_200 = [
    "assets/i18n/main/es.json",
    "/api/auth/usuarios",
    "/api/auth/roles"
  ]

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope, _$httpBackend_) ->
    scope = $rootScope.$new()
    UsuariosCtrl = $controller 'UsuariosCtrl',
      $scope: scope
    $httpBackend = _$httpBackend_
    for url in mocked_responses_200 
      $httpBackend.whenGET(url).respond(200)

  it 'should ...', ->
    expect(1).toEqual 1
    $httpBackend.flush();
