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
  Positionable = (item, start_vec2D, width, height) ->
    this.id = this.getId()
    this.item = item
    this.box = [
      start_vec2D,
      vec2DSum(start_vec2D, [width, 0]),
      vec2DSum(start_vec2D, [width, height]),
      vec2DSum(start_vec2D, [0, height]),
    ]

  Positionable.prototype = {
    counter: 0,
    getId: () ->
      tmp = Positionable.counter
      Positionable.counter++
      return tmp
    bounds: () ->
      return this.box
  }
  ### FIN: Class Positionable ###

  ### Class Node ###
  Node = (start_vec2D, width, height) ->
    this.start = start_vec2D
    this.width = width
    this.height = height
    ## VERTICES
    this.box = [
      start_vec2D,
      vec2DSum(start_vec2D, [width, 0]),
      vec2DSum(start_vec2D, [width, height]),
      vec2DSum(start_vec2D, [0, height])
    ]

    this.objects = []
    this.children = []

  Node.prototype = {
    ### 
      @param object: Positionable
    ###
    appendObject: (object) ->
      if this.objects.length >= MAX_OBJECTS_PER_NODE
        this.split()

      if this.hasChildren()
        for child in this.children
          if child.overlaps(object)
            child.appendObject(object)
      else
        this.objects.push(object)

    hasChildren: () ->
      return this.children.length > 0

    ###
      @param object: Positionable
    ###
    overlaps: (object) ->
      object_box = object.bounds()

      return !(
        (this.box[A][X] > object_box[B][X]) ||
        (this.box[B][X] < object_box[A][X]) ||
        (this.box[A][Y] > object_box[C][Y]) ||
        (this.box[D][Y] < object_box[A][Y])
      )

    ###
      @param A: vec2D
      @param B: vec2D
    ###
    overlapsRect: (A, C) ->
      D = [A[X], C[Y]]
      B = [C[X], A[Y]]

      return !(
        (this.box[A][X] > B[X]) ||
        (this.box[B][X] < A[X]) ||
        (this.box[A][Y] > C[Y]) ||
        (this.box[D][Y] < A[Y])
      )

    ###
      @param A: vec2D
      @param B: vec2D
    ###
    searchRect: (A, C) ->
      found_objects = []
      if this.hasChildren()
        for child in this.children
          if this.overlapsRect(A, C)
            for found_object in child.searchRect(A, C)
              found_objects.push(found_object)
      else
        if this.overlapsRect(A, C)
          for found_object in this.objects
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
      for object in this.objects
        for subnode in this.children
          if subnode.overlaps(object)
            subnode.appendObject(object)
      this.objects = []

    split: () ->
      new_w = this.width/2.0
      new_h = this.height/2.0
      this.children = [
        new Node(this.start, new_w, new_h),
        new Node(
          vec2DSum(this.start, [new_w, 0]), 
          new_w, 
          new_h
        ),
        new Node(
          vec2DSum(this.start, [new_w, new_h]), 
          new_w, new_h
        ),
        new Node(
          vec2DSum(this.start, [0, new_h]), 
          new_w, new_h
        )
      ]
      this.splitObjects()
  }
  ### FIN: Class Node ###

  ### Class QuadTree ###
  QuadTree = () ->
    this.index_root = null

  QuadTree.prototype = {
    init: (width, height) ->
      return Node([0,0], width, height)

    put: (vec2D, width, height, item) ->
      object_positionable = new Positionable(item, vec2D, width, height)
      this.index_root.appendObject(object_positionable)

    ### QuadTreeIndex.get
      Returns al objects found inside a rectangle formed by 
      the two vectors passed as parameters.
    ###
    get: (A, C) ->
      found = this.index_root.searchRect(A, C)
      return $.map(found, (positionable)->
        return positionable.item
      )
  }
  ### FIN: Class QuadTree ###

  return (new QuadTree())