'use strict'

describe 'Controller: DashboardCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  DashboardCtrl = undefined
  scope = undefined
  $httpBackend = undefined
  mocked_responses_200 = [
    "assets/i18n/main/es.json"
  ]

  # Initialize the controller and a mock scope
  beforeEach inject (_$httpBackend_, $controller, $rootScope) ->
    $httpBackend = _$httpBackend_
    for url in mocked_responses_200 
      $httpBackend.whenGET(url).respond(200)

    scope = $rootScope.$new()
    DashboardCtrl = $controller 'DashboardCtrl',
      $scope: scope,
      socket: {
        syncUpdates: ->
        unsyncUpdates: ->
      }

  it 'should ...', ->
    expect(1).toEqual 1
    #$httpBackend.flush();
