### Renders errors over a canvas ###

angular.module "pfcLaminasNodeApp"
.factory "ErrorRenderer", (quadTreeIndex, Vector2D, $q) ->

  ## VECTOR CONSTANTS
  X = 0
  Y = 1
  ## RECT CONSTANTS
  A = 0
  B = 1
  C = 2
  D = 3

  ###
    interface IError {
        public int id;
        public int zIndex;
        public Vec2D topleftVec2D();
        public float width();
        public float height();
        public void drawYourself(context: Canvas2DContext)
        public Box bounds();
    }
  ###

  ### Clase ERROR ###
  class Error
    ### implements IError ###

    @COLOR: "#ff0000"
    @LINE_WIDTH: 5

    constructor: (center_vec2D, radius, category_slug, id) ->
      ### id
        identificador numerico del error, requerido para funcionar con el index
      ###
      if id == undefined
        @id = getErrorId()
      else
        @id = id
      ### center
        centro del error
      ###
      @center = center_vec2D
      ### radius
        radio del error
      ###
      @radius = radius
      ### category_slug
        identificador normalizado del tipo/categoria de error
      ### 
      @category_slug = category_slug
      ### created_at
      ###
      @created_at = new Date()
      ### updated_at
      ###
      @updated_at = new Date()
      ### author_slug 
        Contiene el identificador normalizado del autor
      ###
      @author_slug = null
      ### max_error_level
        valor de la densidad de error en el centro del error
      ###
      @max_error_level = 1
      ### decay_function:
        Funcion de decadencia: calcula la densidad de error a medida que nos 
        alejamos del centro
      ###
      @decay_function = (r) ->
        return 1 / (r*r)

      ### zIndex
        Posicion del error en el eje Z, se usa para saber
        que errores se dibujan primero.
        No tiene utilidad en general, pero por ejemplo cuando un error
        esta seleccionado, su zIndex puede aumentar para asegurarnos de que 
        se dibuja por encima del resto
      ###
      @zIndex = 0

    ### SECTION funciones del interface ###
    width: () ->
      return 2 * @radius

    height: () ->
      return 2 * @radius

    topleftVec2D: () ->
      return Vector2D.sum(@center, [-@radius, -@radius])

    bounds: () ->
      return new Box(
        Vector2D.sum(@center, [-@radius, -@radius]),
        Vector2D.sum(@center, [@radius, -@radius]),
        Vector2D.sum(@center, [@radius, @radius]),
        Vector2D.sum(@center, [-@radius, @radius])
      )

    ###
      @param Canvas2DContext ctx 
    ### 
    drawYourself: (ctx) ->
      ctx.beginPath()
      ctx.arc(@center[X], @center[Y], @radius, 0, Math.PI * 2)
      ctx.lineWidth = Error.LINE_WIDTH
      ctx.strokeStyle = ERROR.COLOR
      ctx.stroke()

    ### ENDSECTION funciones del interface ###

    ### SECTION metodos para mapa de calor ###

    ###
      @param Vec2D A
      @param Vec2D B
    ###
    getAreaErrorLevel: (A, C) ->
      center = [A[X] + (C[X] - A[X])/2, A[Y] + (C[Y] - A[Y])/2]
      R = Vector2D.norm(center, @center)
      error_level = @decay_function(R) * @max_error_level
      return error_level

    ### ENDSECTION metodos para mapa de calor ###

  ### FIN: Clase ERROR ###

  ### Clase ErrorRenderer
    Se ocupa de todas las operaciones de presentacion
    de los errores en un canvas
  ###
  class ErrorRenderer

    constructor: () ->
      @error_log = []
      @info_log = []
      @pinfo("START ErrorRenderer")
      @bg = new Image()
      @bg.className = "hidden"

      @error_hash = {}
      @dirty_errors = []
      @canvas_jquery_node = undefined
      @quad_tree_index = quadTreeIndex
      @root_scope = undefined

    perror: (msg) ->
      now = new Date()
      @error_log.push(now.toDateString() + " " + msg)

    pinfo: (msg) ->
      now = new Date()
      @info_log.push(now.toDateString() + " " + msg)

    ###
    ###
    init: (canvas_jquery_node, background_image, rootScope) ->
      @root_scope = rootScope
      defer = $q.defer()
      
      host = this
      @bg.onload = () ->
        host.initCanvas()
        host.pinfo("background image load OK (" + background_image + ")")
        rootScope.$apply(defer.resolve)

      @bg.onerror = () ->
        host.perror("error loading background image (" + background_image + ")")
        rootScope.$apply(defer.reject);

      @bg.src = background_image
      @canvas_jquery_node = canvas_jquery_node

      return defer.promise

    initCanvas: () ->
      @setCanvasSize()
      @redrawAll()

    setCanvasSize: () ->
      @canvas_jquery_node.width(@bg.width)
      @canvas_jquery_node.height(@bg.height)

    ###
      @param Canvas2DContext ctx
    ###
    drawFullBackground: (ctx) ->
      ctx.drawImage(@bg, 0, 0, @bg.width, @bg.height)

    ###
      @param Vec2D A
      @param Vec2D C
    ###
    drawBackgroundRect: (A, C) ->
      w = C[X] - A[X]
      h = C[Y] - A[Y]
      ctx.drawImage(@bg, A[X], A[Y], w, h, A[X], A[Y], w, h)

    ###
      @param List<Error> error_list
    ###
    setErrors: (error_list) ->
      for error, index in error_list
        @error_hash[error.id] = error

    ###
    ###
    updateError: (error_id, error_data) ->
      @error_hash[error_id] = error_data
      @dirty_errors[error.id] = error
      @quad_tree_index.removeById(error.id)
      @quad_tree_index.putWithForcedId(error_data.id, 
        error_data, 
        error_data.topleftVec2D(), 
        error_data.width(),
        error_data.height(),
        error_data
      )

    ###
    ###
    addError: (error) ->
      @error_hash[error.id] = error
      @dirty_errors[error.id] = error
      @quad_tree_index.putWithForcedId(error.id, 
        error, 
        error.topleftVec2D(), 
        error.width(),
        error.height(),
        error
      )

    ###
    ###
    redraw: () ->
      for id, error of dirty_errors
        box = error.bounds()
        @redrawRect(box.A, box.C)

    ###
    ###
    redrawAll: () ->
      ctx = @canvas_jquery_node.get(0).getContext("2d")
      @drawFullBackground(ctx)
      errors = []
      for k, v of @error_hash
        errors.push(v)
      zordered_errors = errors.sort(ErrorRenderer.sortByZIndex)
      for error in zordered_errors
        error.drawYourself(ctx)

    ###
    ###
    redrawRect: (A, C) ->
      canvas_2d_context = @canvas_jquery_node.getContext("2d")
      @drawBackgroundRect(A, C)
      objects = @quad_tree_index.getObjects(A, C)
      objects = objects.sort(ErrorRenderer.sortByZIndex)
      for object in objects
        object.drawYourself(canvas_2d_context)

    ###
    ###
    @sortByZIndex: (error_A, error_B) ->
      zindexA = error_A.zindex
      zindexB = error_B.zindex

      if zindexA < zindexB
        return -1
      else if zindexA == zindexB
        return 0
      else if zindexA > zindexB
        return 1

  ### FIN: Clase ErrorRenderer ###

  return new ErrorRenderer()










