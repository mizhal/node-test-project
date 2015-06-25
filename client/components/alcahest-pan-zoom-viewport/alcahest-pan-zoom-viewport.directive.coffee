'use strict'

angular.module 'pfcLaminasNodeApp'
.directive 'alcahestPanZoomViewport', ->
  restrict: 'EA'
  link: (scope, element, attrs) ->

    ## OPERACIONES DE VECTORES 2D
    vec2DSum = (vec2D1, vec2D2) ->
      return [vec2D1[0] + vec2D2[0], vec2D1[1] + vec2D2[1]]
    vec2DDif = (vec2D1, vec2D2) ->
      return [vec2D1[0] - vec2D2[0], vec2D1[1] - vec2D2[1]]
    vec2DInv = (vec2D1, vec2D2) ->
      return [-vec2D1[0] , -vec2D1[1]]
    vec2DScale = (scale, vec2D) ->
      return [scale*vec2D[0], scale*vec2D[1]]
    vec2DPrint = (vec2D) ->
      console.log("<%s, %s>", vec2D[0], vec2D[1])
    ## FIN: OPERACIONES DE VECTORES 2D

    ### MODELOS ###

    ## NOTA: como se usan trasformaciones CSS3 los origenes fisicos de los elementos de la UI
    ## no cambian e inicialmente coinciden.
    scope.viewport = {
      ## el origen del viewport es fisicamente (0,0) y no se mueve
      dom_element: null,
      translation: [0, 0],
      width: 0,
      height: 0,
      center: [0,0],
      world: null,
      active_pan: false,
      pan_start_point: [0, 0]
      update: () ->
        this.width = this.dom_element.width()
        this.height = this.dom_element.height()

      moveTo: (translation) ->
        this.translation = translation

      move: (translation) ->
        this.translation = vec2DSum(this.translation, translation)

      zoom: (scale) ->
        this.world.zoom(scale)

      draw: () ->
        this.world.draw()

      finishPan: () ->
        this.active_pan = false
        this.dom_element.css "cursor", "default"

      startPan: (point) ->
        this.pan_start_point = point
        this.active_pan = true
        this.dom_element.css "cursor", "move" 

      pan: (point) ->  
        delta = vec2DDif(point, this.pan_start_point)
        this.move(delta)
        this.pan_start_point = point
        this.draw()

      activePan: () ->
        return this.active_pan

    }
    scope.world = {
      dom_element: null,
      viewport: null,
      scale: 1,
      ## traslacion entre el origen inicial del mundo y la compensacion por el zoom
      translation: [0, 0], 
      width: element.width(),
      height: element.height(),
      zoom: (scale) ->
        this.scale *= scale
        compensation_vector = [
          - this.width * (1 - this.scale) / 2,
          - this.height * (1 - this.scale) / 2
        ]
        # Hay que poner el vector de compensacion en la escala 1
        compensation_vector = vec2DScale(1 / this.scale, compensation_vector)
        this.translation = vec2DSum(this.translation, compensation_vector)
      draw: () ->
        ### 
          escala del mundo y traslacion (inversa) del viewport
          en este modelo no se mueve el viewport sino el mundo 
        ###
        formula = "scale(" + this.scale + ", " + this.scale +
          ") translate(" + this.viewport.translation[0] + "px," + 
          this.viewport.translation[1] + "px)"
        ### traslacion inicial del mundo para compensar el escalado centrado ###
        formula = "translate(" + this.translation[0] + "px," + 
          this.translation[1] + "px) " + formula
        
        this.dom_element.css 'transform', formula

      update: () ->
        this.origin[0] = this.dom_element.position().left
        this.origin[1] = this.dom_element.position().top
        this.width = this.dom_element.width() * this.scale
        this.height = this.dom_element.height() * this.scale
        this.center[0] = this.origin[0] + this.width / 2.0
        this.center[1] = this.origin[1] + this.height / 2.0

      center: (element, scope) ->
        this.moveViewportTo(this.center)
        this.moveViewport([this.viewport.width/2, this.viewport.height/2])
        this.draw()

    }
    ### inicializacion ###
    scope.viewport.dom_element = element.parent()
    scope.world.dom_element = element
    scope.world.viewport = scope.viewport
    scope.viewport.world = scope.world
    ### FIN: MODELOS ###

    ## eventos de navegador
    element.parent().mousemove (event) ->
      if scope.viewport.activePan()
        scope.viewport.pan([event.screenX, event.screenY])

    element.parent().click (event) ->
      if scope.viewport.activePan()
        scope.viewport.finishPan()
      else 
        scope.viewport.startPan([event.screenX, event.screenY])
    ## fin: eventos de navegador

    ## eventos de angular
    scope.$on "alcahest:pan-center", () ->
      scope.viewport.center()
      scope.viewport.draw()

    scope.$on "alcahest:pan-left", () ->
      scope.viewport.move([-50, 0])
      scope.viewport.draw()

    scope.$on "alcahest:pan-up", () ->
      scope.viewport.move([0, -50])
      scope.viewport.draw()

    scope.$on "alcahest:pan-right", () ->
      scope.viewport.move([50, 0])
      scope.viewport.draw()

    scope.$on "alcahest:pan-down", () ->
      scope.viewport.move([0, 50])
      scope.viewport.draw()

    scope.$on "alcahest:zoom-minus", () ->
      scope.viewport.zoom(0.8)
      scope.viewport.draw()

    scope.$on "alcahest:zoom-plus", () ->
      scope.viewport.zoom(1.25)
      scope.viewport.draw()  

    ## fin: eventos de angular