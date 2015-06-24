'use strict'

angular.module 'pfcLaminasNodeApp'
.directive 'alcahestPanZoom', ->
  restrict: 'EA'
  link: (scope, element, attrs) ->
    scope.doing_pan = false
    scope.start_point = [null, null]
    scope.translated_point = [0,0]
    scope.zoom_anchor = [0,0]
    scope.zoom_level = 1
    scope.drawing = {
      origin: [element.position().left, element.position().top],
      width: element.width() * scope.zoom_level,
      height: element.height() * scope.zoom_level,
      center: [0, 0],
      update: () ->
        this.origin[0] = element.position().left
        this.origin[1] = element.position().top
        this.width = element.width() * scope.zoom_level
        this.height = element.height() * scope.zoom_level
        this.center[0] = this.origin[0] + this.width / 2.0
        this.center[1] = this.origin[1] + this.height / 2.0
    }
    scope.viewer = {
      origin: [element.parent().position().left, element.parent().position().top],
      width: element.parent().width(),
      height: element.parent().height(),
      center: [0,0],
      update: () ->
        this.origin[0] = element.parent().position().left
        this.origin[1] = element.parent().position().top
        this.width = element.parent().width()
        this.height = element.parent().height()
        this.center[0] = this.origin[0] + this.width / 2.0
        this.center[1] = this.origin[1] + this.height / 2.0
    }

    ## funciones
    applyTransform = (element, scope, pre_translation) ->
      formula = "scale(" + scope.zoom_level + ", " + scope.zoom_level +
        ") translate(" + scope.translated_point[0] + "px," + 
        scope.translated_point[1] + "px)"
      if pre_translation
        formula = "translate(" + pre_translation[0] + "px," + 
          pre_translation[1] + "px) " + formula
      
      element.css 'transform', formula

    centerTranslation = (element, scope) ->
      scope.drawing.update()
      scope.viewer.update()
      c_t = vec2DDif(scope.viewer.center, scope.drawing.center)
      return c_t

    mouseMove = (element, scope, event) ->
      delta = vec2DDif([event.screenX, event.screenY], scope.start_point)
      ## delta esta en la escala del nivel de zoom actual, ponerla en escala 1
      delta = vec2DScale(1/scope.zoom_level, delta)
      ## porque translated_point siempre esta en escala 1
      scope.translated_point = vec2DSum(scope.translated_point, delta)
      scope.start_point = [event.screenX, event.screenY]
      applyTransform(element, scope, scope.zoom_anchor)

    forcedMove = (element, scope, delta_x, delta_y) ->
      delta = vect2DScale(1/scope.zoom_level, [delta_x, delta_y])
      scope.translated_point = vec2DSum(scope.translated_point, delta)
      applyTransform(element, scope, scope.zoom_anchor)

    zoom = (element, scope, scale) ->
      scope.zoom_level *= scale
      scope.drawing.update()
      delta_zoom = []
      ## delta zoom (Dz) contiene el desplazamiento debido a que el Zoom en CSS3 es
      ## centrado en el objeto transformado y por lo tanto no conserva la alineación de los 
      ## origenes del Visor y del objeto transformado.
      ## Dz tiene como valor la mitad del incremento de escala en x e y (ya que el 
      ## incremento se realiza centrado en el objeto transformado en ambos ejes)
      ## Debido al orden de aplicación de las transformaciones:
      ## Sr0 --> (traslate) --> Sr1 --> (scale) --> Sr2
      ## es necesario corregir Dz, que esta calculado en Sr2, para poder aplicarlo en Sr1
      ## Para ello deshacemos el escalado, multiplicando por la inversa del factor de escala
      ## (scope.zoomlevel) 

      delta_zoom_sr2 = [
        scope.drawing.width * (scope.zoom_level - 1) / 2,
        scope.drawing.height * (scope.zoom_level - 1) / 2
      ]

      delta_zoom = [
        scope.drawing.width * (1 - scope.zoom_level) / 2,
        scope.drawing.height * (1 - scope.zoom_level) / 2
      ]
      console.log("** calculated delta zoom = <%s, %s>", delta_zoom[0], delta_zoom[1])
      delta_zoom_sr1 = vec2DScale(-1 / scope.zoom_level, delta_zoom)
      scope.zoom_anchor = delta_zoom_sr1
      applyTransform(element, scope, scope.zoom_anchor)

    centerDrawing = (element, scope) ->
      center_translation = centerTranslation(element, scope)
      scope.translated_point = vec2DSum(scope.translated_point, center_translation)
      applyTransform(element, scope, scope.zoom_anchor)
    ## fin: funciones

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

    ## METODOS DE DEBUG
    framePrint = (frame) ->
      console.log("(O:<%s, %s>, W:%s, H:%s, C:<%s, %s>)", 
        frame.origin[0], frame.origin[1],
        frame.width, frame.height,
        frame.center[0], frame.center[1])

    printFrames = (note) ->
      scope.drawing.update()
      scope.viewer.update()
      console.log("Drawing " + note)
      framePrint(scope.drawing)
      console.log("Viewer " + note)
      framePrint(scope.viewer)
    ## FIN: METODOS DE DEBUG

    ## eventos de navegador
    element.parent().click (event) ->
      if scope.doing_pan
        scope.doing_pan = false
        element.css "cursor", "default"
      else 
        scope.start_point = [event.screenX, event.screenY]
        scope.doing_pan = true
        element.css "cursor", "move"

    element.parent().mousemove (event) ->
      if scope.doing_pan
        mouseMove(element, scope, event)
    ## fin: eventos de navegador

    ## eventos de angular
    scope.$on "alcahest:pan-left", () ->
      centerDrawing(element, scope)
      #forcedMove(element, scope, -50, 0)
    scope.$on "alcahest:pan-up", () ->
      forcedMove(element, scope, 0, -50)
    scope.$on "alcahest:pan-right", () ->
      forcedMove(element, scope, 50, 0)
    scope.$on "alcahest:pan-down", () ->
      forcedMove(element, scope, 0, 50)
    scope.$on "alcahest:zoom-minus", () ->
      zoom(element, scope, 0.8)
    scope.$on "alcahest:zoom-plus", () ->
      zoom(element, scope, 1.25)      
    ## fin: eventos de angular