'use strict'

describe 'Directive: alcahestPanZoomViewport', ->

  # load the directive's module
  beforeEach module 'pfcLaminasNodeApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<alcahest-pan-zoom-viewport></alcahest-pan-zoom-viewport>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the alcahestPanZoomViewport directive'
