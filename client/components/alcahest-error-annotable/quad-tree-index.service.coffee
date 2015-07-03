### Service QuadTreeIndex
  Todas las listas siguen el orden de las agujas del reloj empezando por
  la esquina del origen de la pantalla (top - left)
    A: topleft B: topright C: bottomrigth D: bottomleft

    0: topleft 1: topright 2: bottomrigth 3: bottomleft
###

angular.module "alcahest"
.factory "quadTreeIndex", (Vector2D) ->
  ###
    typedef vec2D float[2] <- [x, y]
    typedef rect2D float[4] <- [topleft, toprigth, bottomrigth, bottomleft]
    typedef node2D struct {
      rect2D bounds
      float width
      float height
    }
    interface Positionable {
      vec2D position() : returns x, y of topleft of object boundingbox
      rect2D bounds() : returns object boundingbox
    }
  ###

  MAX_OBJECTS_PER_NODE = 5

  ## VECTOR CONSTANTS
  X = 0
  Y = 1
  ## RECT CONSTANTS
  A = 0
  B = 1
  C = 2
  D = 3

  ### Class Box ###
  class Box
    constructor: (@A, @B, @C, @D) ->

    overlapsRect: (Av, Cv) ->
      Dv = [Av[X], Cv[Y]]
      Bv = [Cv[X], Av[Y]]

      return !(
        (@A[X] > Bv[X]) ||
        (@B[X] < Av[X]) ||
        (@A[Y] > Cv[Y]) ||
        (@D[Y] < Av[Y])
      )

    overlaps: (other_box) ->

      return !(
        (@A[X] > other_box.B[X]) ||
        (@B[X] < other_box.A[X]) ||
        (@A[Y] > other_box.C[Y]) ||
        (@D[Y] < other_box.A[Y])
      )

  ### Class Positionable ###
  class Positionable
    constructor: (item, start_vec2D, width, height) ->
      @id = this.getId()
      @item = item
      @box = new Box(
        start_vec2D,
        Vector2D.sum(start_vec2D, [width, 0]),
        Vector2D.sum(start_vec2D, [width, height]),
        Vector2D.sum(start_vec2D, [0, height]),
      )

    @counter: 0

    ### getId
      Asigna un Id unico a cada objeto posicionable para eliminar
      duplicados mas facilmente
    ###
    getId: () ->
      tmp = Positionable.counter
      Positionable.counter++
      return tmp

    position: () ->
      return @box[0]

    bounds: () ->
      return @box

    overlapsRect: (Av, Cv) ->
      return @box.overlapsRect(Av, Cv)

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
      @box = new Box(
         start_vec2D,
         Vector2D.sum(start_vec2D, [width, 0]),
         Vector2D.sum(start_vec2D, [width, height]),
         Vector2D.sum(start_vec2D, [0, height])
      )

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
      return @box.overlaps(object.bounds() )
    ###
      @param A: vec2D
      @param B: vec2D
    ###
    overlapsRect: (Av, Cv) ->
      return @box.overlapsRect(Av, Cv)

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
            if found_object.overlapsRect(A , C)
              found_objects.push(found_object)

      ## Habra duplicados (objetos de mayor tamanyo que un nodo)
      uniq = {}
      for obj in found_objects
        uniq[obj.id] = obj

      found_objects_uniq = []
      for key, value of uniq
        found_objects_uniq.push(value)

      return found_objects_uniq

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

      new_w = @width / 2.0
      new_h = @height / 2.0

      @children = [
        new QNode(@start, new_w, new_h, @parent),
        new QNode(
          Vector2D.sum(@start, [new_w, 0]),
          new_w,
          new_h,
          @parent
        ),
        new QNode(
          Vector2D.sum(@start, [new_w, new_h]),
          new_w,
          new_h,
          @parent
        ),
        new QNode(
          Vector2D.sum(@start, [0, new_h], @parent),
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

    removeById: (object_id) ->
      found = @objects.filter (object) ->
        return object.id == object_id
      if found.length > 0
        for found_i in found
          idx = @objects.indexOf(found_i)
          @objects.splice(idx, 1)
      if @hasChildren()
        for child in @children
          child.removeById(object_id)

  ### FIN: Class QNode ###

  ### Class QuadTree ###
  class QuadTree
    constructor: () ->
      @index_root = new QNode([0, 0], 100, 100, this)
      @min_width = 10
      @min_height = 10

    init: (width, height, min_width, min_height) ->
      @clear()
      @index_root = new QNode([0, 0], width, height, this)
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

    putWithForcedId: (id, vec2D, width, height, item) ->
      object_positionable = new Positionable(item, vec2D, width, height)
      object_positionable.id = id
      @index_root.appendObject(object_positionable)

    ### QuadTreeIndex.get
      Returns all objects found inside a rectangle formed by
      the two vectors passed as parameters.
    ###
    getObjects: (A, C) ->
      found = @index_root.searchRect(A, C)
      return $.map found, (positionable, index) ->
        return positionable.item

    ### QuadTreeIndex.getPositionables
      Returns all objects with bounding box and z - index found inside a rectangle formed by
      the two vectors passed as parameters.
    ###
    getPositionables: (A, C) ->
      return @index_root.searchRect(A, C)

    newNode: (start, w, h) ->
      return new QNode(start, w, h, this)

    clear: () ->
      @index_root.clear()
      @index_root = new QNode([0, 0], @index_root.width, @index_root.height, this)

    countObjects: () ->
      ids_found = @index_root.annotateObjectIds()
      unique = {}
      for id in ids_found
        unique[id] = 1
      return Object.keys(unique).length

    countNodes: () ->
      return @index_root.countNodes()

    removeById: (object_id) ->
      @index_root.removeById(object_id)

  ### FIN: Class QuadTree ###

  return new QuadTree()