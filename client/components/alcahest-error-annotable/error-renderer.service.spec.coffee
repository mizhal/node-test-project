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

  it 'creates new errors', (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      error = errorRenderer.createError([0,0], 10, 'cat-1-error', 10, 1)
      error = errorRenderer.createError([0,0], 10, 'cat-1-error', 10)
      done()

  it 'notifies unloadable image', (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/ninonino.png"
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.catch () ->
      expect(errorRenderer.error_log.length).toBeGreaterThan(0)
      done()

  it 'sets and draws errors', (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      error1 = errorRenderer.createError([0,0], 10, 'cat-1-error', 10, 1)
      error2 = errorRenderer.createError([0,0], 10, 'cat-1-error', 10, 2)
      errorRenderer.setErrors([error1, error2])
      errorRenderer.redraw()
      expect(errorRenderer.dirty_errors).toEqual({})
      done()

  it 'updates errors', (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      CENTER1 = [12, 12]
      CENTER2 = [231, 123]
      error1 = errorRenderer.createError([0,0], 10, 'cat-1-error', 10, 1)
      error2 = errorRenderer.createError(CENTER1, 10, 'cat-1-error', 10, 2)
      errorRenderer.setErrors([error1, error2])
      errorRenderer.redraw()
      expect(errorRenderer.dirty_errors).toEqual({})

      error2 = errorRenderer.findErrorById(2)
      expect(error2.center).toEqual(CENTER1)

      errorRenderer.updateError(CENTER2, 10, 'cat-200-Error', 10, 2)

      error2 = errorRenderer.findErrorById(2)
      expect(error2.center).toEqual(CENTER2)  
      expect(error2.category_slug).toBe("cat-200-Error")    

      done()

  it "Can calculate error density", (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    MAX_ERROR_LEVEL = 20
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      error1 = errorRenderer.createError([120,120], 10, 'cat-1-error', MAX_ERROR_LEVEL, 1)
      error2 = errorRenderer.createError([100, 100], 10, 'cat-1-error', MAX_ERROR_LEVEL, 2)

      errorRenderer.setErrors([error1, error2])

      expect(error1.topleftVec2D()).toEqual([110, 110], "top left coordinate")
      expect(error1.bottomleftVec2D()).toEqual([110, 130], "bottom left coordinate")

      ### maximo en el centro ###
      elevel = error1.getAreaErrorLevel(error1.topleftVec2D(), error1.bottomrightVec2D())
      expect(elevel).toBe(MAX_ERROR_LEVEL, "Maximo en en centro")

      ### cero en el radio ###
      elevel = error1.getAreaErrorLevel(error1.topleftVec2D(), error1.bottomleftVec2D())
      expect(elevel).toBe(0, "Cero en el borde")      

      done()

  it "can create and delete errors and sort them by zIndex", (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    MAX_ERROR_LEVEL = 20
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      error1 = errorRenderer.createError([-500,-500], 10, 'cat-1-error', MAX_ERROR_LEVEL, 1)
      error2 = errorRenderer.createError([100, 100], 10, 'cat-1-error', MAX_ERROR_LEVEL, 2)
      error3 = errorRenderer.createError([90, 90], 10, 'cat-1-error', MAX_ERROR_LEVEL, 3)
      error4 = errorRenderer.createError([200, 150], 5, 'cat-1-error', MAX_ERROR_LEVEL, 4)

      errors = [error1, error2, error3, error4]
      errorRenderer.setErrors(errors)
      errorRenderer.clear()
      errorRenderer.setErrors(errors)
      errorRenderer.redrawAll()
      errorRenderer.sortErrors(errors)
      canvas = errorRenderer.canvas_jquery_node
      ctx = canvas.get(0).getContext("2d")
      errorRenderer.drawBackgroundRect([-10,-10], [-1,-1], ctx)
      errorRenderer.redrawRect([0,0], [canvas.width(), canvas.height()])

      done()

  it "can sort errors by zIndex", (done) ->
    $httpBackend.expectGET("assets/i18n/main/es.json").respond(200)
    IMAGE = "/base/client/fixtures/images/carousel1.png"
    MAX_ERROR_LEVEL = 20
    promise = errorRenderer.init($("<canvas/>"), IMAGE, scope)
    promise.then () ->
      errors = [
        {id: 1, zIndex: 5},
        {id: 2, zIndex: 4},
        {id: 3, zIndex: 3},
        {id: 4, zIndex: 2},
        {id: 5, zIndex: 1},        
      ]

      sorted_errors = errorRenderer.sortErrors(errors)
      error_ids = $.map sorted_errors, (e) ->
        return e.id
      expect(error_ids).toEqual([5,4,3,2,1])
      done()
