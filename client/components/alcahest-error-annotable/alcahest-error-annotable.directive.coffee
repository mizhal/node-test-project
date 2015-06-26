'use strict'

###
  Este modulo emite los eventos
    "alcahest-error-create", con args = [x,y,radius]
    "alcahest-error-modified", con args = [error_id, new_x, new_y, new_radius]
###

angular.module 'pfcLaminasNodeApp'
.directive 'alcahestErrorAnnotable', ->
  restrict: 'EA'
  link: (scope, element, attrs) ->
    scope.current = {
      viewport_translation: [0, 0],
      setting_radius: false,
      center: [0, 0],
      radius: 0,
      border_ui: null,
      center_cross_ui: null,
      handle_ui: null,
      radius_ui: null,
      putUiInCenter: (ui_element) ->
        ui_element.css "margin-left", "-50%"
        ui_element.css "margin-top", "-50%"
        ui_element.css "left", this.center[0]
        ui_element.css "top", this.center[1]
        console.log("Centered to <%s, %s>", this.center[0], this.center[1]);
      putUiInCircle: (ui_element, angle_degrees) ->
        radians = (angle_degrees % 360) * (Math.PI / 180)
        ui_element.css "margin-left", "-50%"
        ui_element.css "margin-top", "-50%"
        ui_element.css "left", (this.center[0] + this.radius * Math.cos(radians))
        ui_element.css "top", (this.center[1] + this.radius * Math.sin(radians))  
      centerInMouse: (ui_element, event) ->
        ui_element.css "margin-left", "-50%"
        ui_element.css "margin-top", "-50%"
        ui_element.css "left", (this.fromViewportToDrawing(event.offset))
        ui_element.css "top", (this.center[1] + this.radius * Math.sin(radians))         

      updateCenter: (event) ->
        this.center = [event.pageX, event.pageY]
      createFront: (element) ->
        this.radius = 40

        this.border_ui = $('<div id="new-error" class="error positionable"></div>')
        #this.center_cross_ui = $('<div id="new-error" class="center-cross positionable"></div>')
        #this.handle_ui = $('<div id="new-error" class="handle positionable"></div>')

        element.append(this.border_ui)
        #element.append(this.center_cross_ui)
        #element.append(this.handle_ui)

        this.putUiInCenter(this.border_ui)
        #this.putUiInCenter(this.center_cross_ui)
        #this.putUiInCircle(this.handle_ui, 45)
      updateFront: () ->
        diam = this.radius * 2
        border_ui = this.border_ui
        border_ui.css("width", diam + "px")
        border_ui.css("height", diam + "px")
      commitError: () ->
        this.setting_radius = false
        scope.$emit("alcahest-error:create-error", {
            center: this.center,
            radius: this.radius
          })
        this.center = [0,0]
        this.radius = 0
        this.front_div = null
      createMouseHandle: () ->
        self = this
        return (event) ->
          if scope.selected_annotation_tool
            if self.setting_radius
              delta = vec2DDif(self.center, [event.pageX, event.pageY])
              self.radius = vec2DNorm(delta)
              self.updateFront()
              event.preventDefault()
              return false
      createClickHandle: () ->
        self = this
        return (event) ->
          if scope.selected_annotation_tool
            if scope.current.setting_radius
              scope.current.commitError()
            else
              scope.current.updateCenter(event)
              scope.current.setting_radius = true
              scope.current.createFront(element)
              scope.current.updateFront()
    }

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
    vec2DSet = (vec2D, x, y) ->
      vec2D[0] = x
      vec2D[1] = y
    vec2DNorm = (vec2D) ->
      return Math.sqrt(vec2D[0]*vec2D[0] + vec2D[1]*vec2D[1]);
    ## FIN: OPERACIONES DE VECTORES 2D

    ## METODOS

    ## FIN: METODOS 

    ## EVENTOS DE NAVEGADOR
    element.on "click", scope.current.createClickHandle()
    element.on "mousemove", scope.current.createMouseHandle()

        
    ## FIN: EVENTOS DE NAVEGADOR

    ## EVENTOS DE ANGULAR
    scope.$on "alcahest-error:activate-canvas", () ->
      scope.selected_annotation_tool = true
      console.log("EDIT MODE ON")

    scope.$on "alcahest-error:deactivate-canvas", () ->
      scope.selected_annotation_tool = false
      console.log("EDIT MODE OFF")

    scope.$on "alcahest:viewport-translation", (viewport_translation) ->
      scope.current.viewport_translation = viewport_translation
    ## FIN: EVENTOS DE ANGULAR


