### Editable camera ###

angular.module "alcahest"
.factory "EditableCamera", (Vector2D, ErrorRenderer) ->

  ### CONSTANTES DE COORDENADAS ###
  X = 0
  Y = 1
  ### FIN: CONSTANTES DE COORDENADAS ###

  class ErrorUIElement
    @DEFAULT_RADIUS: 10,
    constructor: (element, event) ->
      @element = element
      @ensureCSSPositioning(@element)
      @radius = ErrorUIElement.DEFAULT_RADIUS
      @center = [0, 0]
      @angle_rads = 0
      @createDOMNodes()
      @centerInMouse(event)
      @update()

    ensureCSSPositioning: (element) ->
      current = @element.css("position")
      if current == undefined || current == "static"
        @element.css("position", "relative")

    createDOMNodes: () ->
      @ui = $('<div id="new-error" class="ui-error"></div>')
      @border = $('<div class="border positionable"></div>')
      @center_cross = $('<div class="center-cross positionable"></div>')
      @handle = $('<div class="handle positionable"></div>')

      @ui.append(@border)
      @ui.append(@center_cross)
      @ui.append(@handle)
      @element.append(@ui)

    update: () ->
      @setDiameter(@ui)
      @centerUI(@ui, @center)
      @putInternalUIInCenter(@center_cross)
      @putInternalUIInCircle(@handle)

    setDiameter: (ui_element) ->
      diam = @radius * 2
      ui_element.css("width", diam + "px")
      ui_element.css("height", diam + "px")

    centerUI: (ui_element, point) ->
      ui_element.css("left", point[X] - @radius)
      ui_element.css("top", point[Y] - @radius)

    putInternalUIInCenter: (ui_element) ->
      v_center = [@radius, @radius]

      ui_element.css("left", v_center[X] - ui_element.width() / 2)
      ui_element.css("top", v_center[Y] - ui_element.height() / 2)

    putInternalUIInCircle: (ui_element) -> 
      v_center = [@radius, @radius]
      ui_element.css("left", 
        (v_center[X] + @radius * Math.cos(@angle_rads)) - ui_element.width() / 2
      )
      ui_element.css("top", 
        (v_center[Y] - @radius * Math.sin(@angle_rads)) - ui_element.height() / 2
      )

    mouseCoords:(event) ->
      return [event.pageX, event.pageY]
  
    centerInMouse: (event) ->
      @center = @mouseCoords(event)

    radiusInMouse: (event) ->
      @radius = Vector2D.dist(@mouseCoords(event), @center)

    angleInMouse: (event) ->
      delta = Vector2D.dif(@mouseCoords(event), @center)
      @angle_rads = Math.atan2(-delta[Y], delta[X])

    debug: (event) ->
      mouse = @mouseCoords(event)
      console.log("center [%s;%s], radius %s, angle %s, mouse [%s;%s]", @center[X], @center[Y], 
        @radius, @angle_rads, mouse[X], mouse[Y])

    destroy: () ->
      @ui.remove()

    toSimpleJSON: () ->
      return {
        center: @center,
        radius: @radius
      }

  class EditableCamera
    constructor: () ->
      @viewport_translation = null
      @viewport_zoom = 1
      @camera_offset = null
      @ui_elements = []
      @selected_annotation_tool = false
      @setting_radius = false

      @scope = null
      @element = null

      @current = null

    init: (scope, element) ->
      @viewport_translation = null
      @viewport_zoom = 1
      @camera_offset = element.position()
      @ui_elements = []
      @selected_annotation_tool = false
      @setting_radius = false

      @scope = scope
      @element = element

      @current = null

      @registerEvents(@scope)
      @registerMouseEvents(@element)

    registerEvents: (scope) ->
      scope.$on "alcahest-error:activate-canvas", @onActivateCanvas
      scope.$on "alcahest-error:deactivate-canvas", @onDeactivateCanvas
      scope.$on "alcahest:viewport-translation", @onViewportTranslation

    registerMouseEvents: (element) ->
      element.on "click", @onClick
      element.on "mousemove", @onMouseMove

    onActivateCanvas: () =>
      @selected_annotation_tool = true
      console.log("EDIT MODE ON")

    onDeactivateCanvas: () => 
      @selected_annotation_tool = false
      console.log("EDIT MODE OFF")

    onViewportTranslation: (viewport_translation) =>
      @viewport_translation = viewport_translation

    commitError: () ->
      @scope.$emit("alcahest-error:commit", @current.toSimpleJSON())
      @current.destroy()
      @current = null

    onClick: (event) =>
      event.stopPropagation()
      if @selected_annotation_tool
        if @setting_radius
          @commitError()
          @setting_radius = false
        else
          @setting_radius = true
          @createUIElement(@element, event)
          @updateUIElement(event)

    onMouseMove: (event) =>
      event.stopPropagation()
      if @selected_annotation_tool
        if @setting_radius
          @updateUIElement(event)

    createUIElement: (element, event) ->
      @current = new ErrorUIElement(element, event)
      @current.centerInMouse(event)

    updateUIElement: (event) ->
      @current.radiusInMouse(event)
      @current.angleInMouse(event)
      @current.update()

  return new EditableCamera()