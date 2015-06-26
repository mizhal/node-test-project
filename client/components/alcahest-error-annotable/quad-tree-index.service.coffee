### Service QuadTreeIndex
  Todas las listas siguen el orden de las agujas del reloj empezando por 
  la esquina del origen de la pantalla (top-left)
    A:topleft B:topright C:bottomrigth D:bottomleft
###

angular.module "pfcLaminasNodeApp"
.factory "quadTreeIndex", () ->
  ###
    typedef vec2D float[2] <- [x, y]
    typedef rect2D float[4] <- [topleft, toprigth, bottomrigth, bottomleft] 
    typedef node2D struct {
      rect2D bounds
      float width
      float height
    }
    interface Positionable {
      vec2D position() : returns x,y of topleft of object boundingbox
      rect2D bounds(): returns object boundingbox
    }
  ###

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

  MAX_OBJECTS_PER_NODE = 5

  ## VECTOR CONSTANTS
  X = 0 
  Y = 1
  ## RECT CONSTANTS
  A = 0
  B = 1
  C = 2
  D = 3

  ### Class Positionable ###
  class Positionable 
    constructor: (item, start_vec2D, width, height) ->
      @id = this.getId()
      @item = item
      @box = [
        start_vec2D,
        vec2DSum(start_vec2D, [width, 0]),
        vec2DSum(start_vec2D, [width, height]),
        vec2DSum(start_vec2D, [0, height]),
      ]

    @counter: 0

    ### getId
      Asigna un Id unico a cada objeto posicionable para eliminar
      duplicados mas facilmente
    ###
    getId: () ->
      tmp = Positionable.counter
      Positionable.counter++
      return tmp

    bounds: () ->
      return @box

  ### FIN: Class Positionable ###

  ### Class Node ###
  class Node
    constructor: (start_vec2D, width, height) ->
      @start = start_vec2D
      @width = width
      @height = height
      ## VERTICES
      @box = [
        start_vec2D,
        vec2DSum(start_vec2D, [width, 0]),
        vec2DSum(start_vec2D, [width, height]),
        vec2DSum(start_vec2D, [0, height])
      ]

      @objects = []
      @children = []

    ### 
      @param object: Positionable
    ###
    appendObject: (object) ->
      if @objects.length >= MAX_OBJECTS_PER_NODE
        split()

      if hasChildren()
        for child in @children
          if child.overlaps(object)
            child.appendObject(object)
      else
        @objects.push(object)

    hasChildren: () ->
      return @children.length > 0

    ###
      @param object: Positionable
    ###
    overlaps: (object) ->
      object_box = object.bounds()

      return !(
        (@box[A][X] > object_box[B][X]) ||
        (@box[B][X] < object_box[A][X]) ||
        (@box[A][Y] > object_box[C][Y]) ||
        (@box[D][Y] < object_box[A][Y])
      )

    ###
      @param A: vec2D
      @param B: vec2D
    ###
    overlapsRect: (A, C) ->
      D = [A[X], C[Y]]
      B = [C[X], A[Y]]

      return !(
        (@box[A][X] > B[X]) ||
        (@box[B][X] < A[X]) ||
        (@box[A][Y] > C[Y]) ||
        (@box[D][Y] < A[Y])
      )

    ###
      @param A: vec2D
      @param B: vec2D
    ###
    searchRect: (A, C) ->
      found_objects = []
      if hasChildren()
        for child in @children
          if overlapsRect(A, C)
            for found_object in child.searchRect(A, C)
              found_objects.push(found_object)
      else
        if @overlapsRect(A, C)
          for found_object in @objects
            found_objects.push(found_object)

      ## Habra duplicados (objetos de mayor tamanyo que un nodo)
      uniq = {}
      for obj in found_objects
        uniq[obj.id] = obj
      found_objects = []
      for key in uniq
        found_objects.push(uniq[key])

      return found_objects

    splitObjects: () ->
      for object in @objects
        for subnode in @children
          if subnode.overlaps(object)
            subnode.appendObject(object)
      @objects = []

    split: () ->
      new_w = @width/2.0
      new_h = @height/2.0
      @children = [
        new Node(@start, new_w, new_h),
        new Node(
          vec2DSum(@start, [new_w, 0]), 
          new_w, 
          new_h
        ),
        new Node(
          vec2DSum(@start, [new_w, new_h]), 
          new_w, new_h
        ),
        new Node(
          vec2DSum(@start, [0, new_h]), 
          new_w, new_h
        )
      ]
      splitObjects()
  
  ### FIN: Class Node ###

  ### Class QuadTree ###
  class QuadTree
    constructor: () ->
      @index_root = new Node([0,0], 100, 100)

    init: (width, height) ->
      this.index_root = new Node([0,0], width, height)

    width: () ->
      return this.index_root.width

    height: () ->
      return this.index_root.height

    put: (vec2D, width, height, item) ->
      object_positionable = new Positionable(item, vec2D, width, height)
      this.index_root.appendObject(object_positionable)

    ### QuadTreeIndex.get
      Returns al objects found inside a rectangle formed by 
      the two vectors passed as parameters.
    ###
    get: (A, C) ->
      found = this.index_root.searchRect(A, C)
      return $.map found, (positionable)->
        return positionable.item

  ### FIN: Class QuadTree ###

  return (new QuadTree())