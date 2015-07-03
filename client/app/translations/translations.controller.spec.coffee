'use strict'

describe 'Controller: TranslationsCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  TranslationsCtrl = undefined
  scope = undefined
  $httpBackend = undefined
  mocked_responses_200 = [
    "assets/i18n/main/es.json",
    "app/main/main.html"
  ]

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope, _$httpBackend_) ->
    scope = $rootScope.$new()
    TranslationsCtrl = $controller 'TranslationsCtrl',
      $scope: scope,
      socket: {
        syncUpdates: ->
        unsyncUpdates: ->
      }
    $httpBackend = _$httpBackend_
    for url in mocked_responses_200
      $httpBackend.whenGET(url).respond(200)
    $httpBackend.expectGET("/api/translations").respond(
      []
    )

  it 'should ...', ->

    expect(1).toEqual 1
    $httpBackend.flush();
