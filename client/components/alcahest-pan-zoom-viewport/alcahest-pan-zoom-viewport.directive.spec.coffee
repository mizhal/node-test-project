'use strict'

describe 'Directive: alcahestPanZoomViewport', ->
  
  beforeEach module 'alcahest'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()
  
