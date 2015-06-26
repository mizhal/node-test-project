'use strict'

describe 'Directive: alcahestErrorAnnotable', ->

  # load the directive's module
  beforeEach module 'pfcLaminasNodeApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<alcahest-error-annotable></alcahest-error-annotable>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the alcahestErrorAnnotable directive'
