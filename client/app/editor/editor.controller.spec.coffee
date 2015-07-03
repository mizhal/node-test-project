'use strict'

describe 'Controller: EditorCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  EditorCtrl = undefined
  scope = undefined
  $httpBackend = undefined
  mocked_responses_200 = [
    "assets/i18n/main/es.json",
    "/api/auth/usuarios"
  ]

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope, _$httpBackend_) ->
    scope = $rootScope.$new()
    EditorCtrl = $controller 'EditorCtrl',
      $scope: scope
    $httpBackend = _$httpBackend_
    for url in mocked_responses_200
      $httpBackend.expectGET(url).respond(200)

  it 'should ...', ->
    expect(1).toEqual 1
    #$httpBackend.flush();
