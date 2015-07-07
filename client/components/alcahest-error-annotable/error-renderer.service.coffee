### Renders errors over a canvas ###

angular.module "pfcLaminasNodeApp"
.factory "ErrorRenderer", (quadTreeIndex, Vector2D, $q, BoxFactory) ->

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
        public Vec2D topleftVec2D() ;
        public float width() ;
        public float height() ;
        public void drawYourself(context: Canvas2DContext)
        public Box bounds() ;
    }
  ###

  ### Clase ERROR ###
  class Error
    ### implements IError ###

    @COLOR: "#ff0000"
    @LINE_WIDTH: 5

    @counter: 0

    @getErrorId: () ->
      tmp = Error.counter
      Error.counter++
      return tmp

    constructor: (center_vec2D, radius, category_slug, category_weigth, id) ->
      ### id
        identificador numerico del error, requerido para funcionar con el index
      ###
      if id == undefined
        @id = Error.getErrorId()
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
        identificador normalizado del tipo / categoria de error
      ###
      @category_slug = category_slug
      ### category_weights
        peso de las categoria de error
      ###
      @category_weigth = category_weigth
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
      ### decay_function:
        Funcion de decadencia: calcula la densidad de error a medida que nos
        alejamos del centro
      ###
      @decay_function = (r) ->
        K = (Math.E - 1) / @radius
        return 1 - Math.log(1 + K * r)

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

    bottomrightVec2D: () ->
      return Vector2D.sum(@center, [@radius, @radius])  
    
    bottomleftVec2D: () ->
      return Vector2D.sum(@center, [-@radius, @radius])  

    bounds: () ->
      return BoxFactory.create(
        Vector2D.sum(@center, [ - @radius, - @radius]),
        Vector2D.sum(@center, [@radius, - @radius]),
        Vector2D.sum(@center, [@radius, @radius]),
        Vector2D.sum(@center, [ - @radius, @radius])
      )

    ###
      @param Canvas2DContext ctx
    ###
    drawYourself: (ctx) ->
      ctx.beginPath()
      ctx.arc(@center[X], @center[Y], @radius, 0, Math.PI * 2)
      ctx.lineWidth = Error.LINE_WIDTH
      ctx.strokeStyle = Error.COLOR
      ctx.stroke()

    ### ENDSECTION funciones del interface ###

    ### SECTION metodos para mapa de calor ###

    ###
      @param Vec2D A
      @param Vec2D B
    ###
    getAreaErrorLevel: (A, C) ->
      center = [A[X] + (C[X] - A[X]) /2, A[Y] + (C[Y] - A[Y])/2]
      r = Vector2D.dist(center, @center)
      error_level = @decay_function(r) * @category_weigth
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
      @dirty_errors = {}
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
        rootScope.$apply(defer.reject) ;

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
    drawBackgroundRect: (A, C, ctx) ->
      ### El canvas no maneja indices negativos ###
      if A[X] < 0
        a_x = 0
      else
        a_x = A[X]

      if A[Y] < 0
        a_y = 0
      else
        a_y = A[Y]

      if C[X] < 0
        c_x = 0
      else
        c_x = C[X]

      if C[Y] < 0
        c_y = 0
      else
        c_y = C[Y] 

      w = c_x - a_x
      h = c_y - a_y
      ctx.drawImage(@bg, a_x, a_y, w, h, a_x, a_y, w, h)

    ###
      @param List < Error > error_list
    ###
    setErrors: (error_list) ->
      @dirty_errors = {}
      @error_hash = {}
      for error, index in error_list
        @addError(error)

    ###
    ###
    updateError: (center_vec2D, radius, category_slug, category_weigth, id) ->
      error = @createError(center_vec2D, radius, category_slug, category_weigth, id)
      @error_hash[id] = error
      @dirty_errors[id] = error
      @quad_tree_index.removeById(id)
      @quad_tree_index.putWithForcedId(error.id,
        error,
        error.topleftVec2D(),
        error.width(),
        error.height(),
        error
      )

    ###
    ###
    addError: (error) ->
      @error_hash[error.id] = error
      @dirty_errors[error.id] = error
      @quad_tree_index.putWithForcedId(error.id,
        error.topleftVec2D(),
        error.width(),
        error.height(),
        error
      )

    ### 
    ###
    findErrorById: (id) ->
      return @error_hash[id]

    ###
    ###
    redraw: () ->
      for id, error of @dirty_errors
        box = error.bounds()
        @redrawRect(box.A, box.C)
      @dirty_errors = {}

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
      canvas_2d_context = @canvas_jquery_node.get(0).getContext("2d")
      @drawBackgroundRect(A, C, canvas_2d_context)
      objects = @quad_tree_index.getObjects(A, C)
      objects = objects.sort(ErrorRenderer.sortByZIndex)
      for object in objects
        object.drawYourself(canvas_2d_context)

    ###
    ###
    @sortByZIndex: (error_A, error_B) ->
      return error_A.zIndex - error_B.zIndex

    sortErrors: (error_list) ->
      return error_list.sort(ErrorRenderer.sortByZIndex)

    createError: (center_vec2D, radius, category_slug, category_weigth, id) ->
      return new Error(center_vec2D, radius, category_slug, category_weigth, id)

    clear: () ->
      @error_hash = {}
      @dirty_errors = {}
      @quad_tree_index.clear()

  ### FIN: Clase ErrorRenderer ###

  return new ErrorRenderer()










