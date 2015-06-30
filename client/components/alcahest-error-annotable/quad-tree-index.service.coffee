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

  ### Class QNode ###
  class QNode
    constructor: (start_vec2D, width, height, quad_tree_index) ->
      @start = start_vec2D
      @width = width
      @height = height
      @parent = quad_tree_index
      if @parent == undefined
        throw "Parent undefined"
      ## VERTICES
      @box = [
        start_vec2D,
        vec2DSum(start_vec2D, [width, 0]),
        vec2DSum(start_vec2D, [width, height]),
        vec2DSum(start_vec2D, [0, height])
      ]

      @objects = []
      @children = []

    NW: () ->
      if @children.length > 0
        return @children[0]

    NE: () ->
      if @children.length > 0
        return @children[1]   

    SE: () ->
      if @children.length > 0
        return @children[2]

    SW: () ->
      if @children.length > 0
        return @children[3]         

    ### 
      @param object: Positionable
    ###
    appendObject: (object) ->
      if @objects.length >= MAX_OBJECTS_PER_NODE
        @split()

      if @hasChildren()
        for child in @children
          if child.overlaps(object)
            child.appendObject(object)
      else
        if @overlaps(object)
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
    overlapsRect: (Av, Cv) ->
      Dv = [Av[X], Cv[Y]]
      Bv = [Cv[X], Av[Y]]

      return !(
        (@box[A][X] > Bv[X]) ||
        (@box[B][X] < Av[X]) ||
        (@box[A][Y] > Cv[Y]) ||
        (@box[D][Y] < Av[Y])
      )

    ###
      @param A: vec2D
      @param B: vec2D
    ###
    searchRect: (A, C) ->
      found_objects = []
      if @hasChildren()
        for child in @children
          if @overlapsRect(A, C)
            for found_object in child.searchRect(A, C)
              found_objects.push(found_object)
      else
        if @overlapsRect(A, C)
          for found_object in @objects
            found_objects.push(found_object)

      return found_objects

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
      if @with <= @parent.min_width || @height <= @parent.min_height
        ## if we have reached the minimum size in any dimension
        ## we won't be doing any more splits
        return

      new_w = @width/2.0
      new_h = @height/2.0

      @children = [
        new QNode(@start, new_w, new_h, @parent),
        new QNode(
          vec2DSum(@start, [new_w, 0]), 
          new_w, 
          new_h,
          @parent
        ),
        new QNode(
          vec2DSum(@start, [new_w, new_h]), 
          new_w, 
          new_h, 
          @parent
        ),
        new QNode(
          vec2DSum(@start, [0, new_h], @parent), 
          new_w, 
          new_h,
          @parent
        )
      ]
      @splitObjects()

    clear: () ->
      @objects = []
      for child in @children
        child.clear()
      @children = []

    annotateObjectIds: () ->
      ids = []
      for object in @objects
        ids.push(object.id)
      for child in @children
        for id in child.annotateObjectIds()
          ids.push(id)
      return ids

    countNodes: () ->
      count = 1
      if @hasChildren()
        for child in @children
          count += child.countNodes()
      return count
  
  ### FIN: Class QNode ###

  ### Class QuadTree ###
  class QuadTree
    constructor: () ->
      @index_root = new QNode([0,0], 100, 100, this)
      @min_width = 10
      @min_height = 10

    init: (width, height, min_width, min_height) ->
      @index_root = new QNode([0,0], width, height, this)
      ### cinco divisiones 2^5 ###
      @min_height = min_height || width / 32
      @min_width = min_width || height / 32

    width: () ->
      return @index_root.width

    height: () ->
      return @index_root.height

    put: (vec2D, width, height, item) ->
      object_positionable = new Positionable(item, vec2D, width, height)
      @index_root.appendObject(object_positionable)

    ### QuadTreeIndex.get
      Returns all objects found inside a rectangle formed by 
      the two vectors passed as parameters.
    ###
    getObjects: (A, C) ->
      found = @index_root.searchRect(A, C)
      return $.map found, (positionable, index)->
        return positionable.item

    ### QuadTreeIndex.getPositionables
      Returns all objects with bounding box and z-index found inside a rectangle formed by 
      the two vectors passed as parameters.
    ###
    getPositionables: (A, C) ->
      return @index_root.searchRect(A, C)

    newNode: (start, w, h) ->
      return new QNode(start, w, h, this)

    clear: () ->
      @index_root.clear()
      @index_root = new QNode([0,0], @index_root.width, @index_root.height, this)

    countObjects: () ->
      ids_found = @index_root.annotateObjectIds()
      unique = new Array()
      for id in ids_found
        unique[id] = 1
      return unique.length

    countNodes: () ->
      return @index_root.countNodes()

  ### FIN: Class QuadTree ###

  return (new QuadTree())