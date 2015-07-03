###
  Spec de ErrorRenderer
###

'use strict'

describe 'Factory: ErrorRenderer', ->

  beforeEach module 'pfcLaminasNodeApp'

  errorRenderer = undefined
  scope = undefined
  $httpBackend = undefined
  beforeEach inject ($rootScope, _ErrorRenderer_, _$httpBackend_) ->
    $httpBackend = _$httpBackend_
    errorRenderer = _ErrorRenderer_
    scope = $rootScope.$new()

  it 'should init', (done) ->
    ### el modulo de traducciones se lanza al cargar la imagen 
      por la razon que sea, y hace una peticion a servidor que
      hay que contemplar
    ###
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)

    inject () ->
      IMAGE = "/base/client/fixtures/images/carousel1.png"
      promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
        .then () ->
          expect(errorRenderer.canvas_jquery_node.width()).toBe(574)
          expect(errorRenderer.canvas_jquery_node.height()).toBe(549)

          done()
        .catch () ->
          expect(false).toBe(true, "ErrorRenderer has run into an error while initiating")       
          done()