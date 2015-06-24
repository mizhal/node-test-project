'use strict'

describe 'Directive: alcahestPanZoom', ->

  # load the directive's module
  beforeEach module 'pfcLaminasNodeApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<alcahest-pan-zoom></alcahest-pan-zoom>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the alcahestPanZoom directive'
