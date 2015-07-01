## Spec
'use strict'

describe 'Service: quadTreeIndex', ->

  # load the service's module
  beforeEach module 'pfcLaminasNodeApp'

  # instantiate service
  quadTreeIndex = undefined
  beforeEach inject (_quadTreeIndex_) ->
    quadTreeIndex = _quadTreeIndex_

  xit 'should init', ->
    quadTreeIndex.init(666, 1201024, 6, 6)
    expect(quadTreeIndex.width() ).toBe(666)
    expect(quadTreeIndex.height() ).toBe(1201024)

  xit 'registers objects and retrieves them', ->
    quadTreeIndex.init(1920, 1080, 19, 10)
    object = {data: "la la la"}
    quadTreeIndex.put([10, 10], 100, 100, object)
    A = [0, 0]
    C = [11, 11]

    results = quadTreeIndex.getObjects(A, C)

    root = quadTreeIndex.index_root
    expect(root.objects.length).toBe(1, "Objects in root node")
    expect(root.overlapsRect([0, 0], [11, 11]) ).toBe(true, "Rectangle overlapping")
    expect(results.length).toBe(1, "Results found by getObjects")

  xit 'creates new nodes', ->
    quadTreeIndex.init(1920, 1080, 19, 10)
    start = [0, 0]
    test_node = new quadTreeIndex.newNode(start, 10, 10)
    expect(test_node.overlapsRect([1, 1], [9, 9]) ).toBe(true)

  xit 'collision test', ->
    ### Test overlappings around an object ###
    quadTreeIndex.init(1920, 1080, 19, 10)
    start = [0, 0]
    test_node = new quadTreeIndex.newNode(start, 10, 10)
    expect(test_node.overlapsRect([1, 1], [9, 9]) ).toBe(true)
    expect(false).toBe(true, "Este test no esta implementado aun")

  xit 'limits test', ->
    ### Test what happens when we put objects around the borders of the
    quadTree index ###
    quadTreeIndex.init(1920, 1080, 19, 10)
    W = 1920
    H = 1080
    ## left border
    object = {data: "left border overlap"}
    quadTreeIndex.put([ - 100, 100], W, H, object)
    ## top border
    object = {data: "top border overlap"}
    quadTreeIndex.put([100, - 100], W, H, object)
    ## right border
    object = {data: "right border overlap"}
    quadTreeIndex.put([1900, 100], W, H, object)
    ## bottom border
    object = {data: "bottom border overlap"}
    quadTreeIndex.put([100, 1000], W, H, object)
    ## topleft border
    object = {data: "topleft border overlap"}
    quadTreeIndex.put([ - 100, - 100], W, H, object)
    ## topright border
    object = {data: "topright border overlap"}
    quadTreeIndex.put([1900, - 100], W, H, object)
    ## bottomright border
    object = {data: "bottomright border overlap"}
    quadTreeIndex.put([1900, 1000], W, H, object)
    ## bottomleft border
    object = {data: "bottomright border overlap"}
    quadTreeIndex.put([ - 100, 1000], W, H, object)

    expect(quadTreeIndex.countObjects() ).toBe(8,
      "Se han anotado ocho nodos superpuestos por los limites del mundo")
    ### Tener en cuenta que con el valor por defecto de 5 ha habido un split
      de nodos
    ###
    total_references = quadTreeIndex.index_root.NW().objects.length +
      quadTreeIndex.index_root.NE().objects.length +
      quadTreeIndex.index_root.SE().objects.length +
      quadTreeIndex.index_root.SW().objects.length
    expect(total_references).toBeGreaterThan(8,
      "Hay referencias al mismo objeto en varios nodos diferentes, pero la cuenta del total coincide")

    quadTreeIndex.clear()

    expect(quadTreeIndex.countObjects() ).toBe(0, "Se ha vaciado el indice")
    ### OUT ###

    ## left out
    object = {data: "left out"}
    quadTreeIndex.put([ - 400, 100], 200, 200, object)
    ## top out
    object = {data: "top out"}
    quadTreeIndex.put([100, - 400], 200, 200, object)
    ## right out
    object = {data: "right out"}
    quadTreeIndex.put([2000, 100], 200, 200, object)
    ## bottom out
    object = {data: "bottom out"}
    quadTreeIndex.put([100, 1100], 200, 200, object)
    ## topleft out
    object = {data: "topleft out"}
    quadTreeIndex.put([ - 400, - 400], 200, 200, object)
    ## topright out
    object = {data: "topright out"}
    quadTreeIndex.put([2000, - 400], 200, 200, object)
    ## bottomright out
    object = {data: "bottomright out"}
    quadTreeIndex.put([2000, 1100], 200, 200, object)
    ## bottomleft out
    object = {data: "bottomleft out"}
    quadTreeIndex.put([ - 400, 1100], 200, 200, object)

    expect(quadTreeIndex.countObjects() ).toBe(0,
      "No deberian anotarse los nodos por estar fuera del mundo")

    quadTreeIndex.clear()

  xit 'doesn\'t split nodes infinitely', ->
    ### Se pone un objeto que tiene mas de cinco instancias en el
      mismo punto del plano. Se espera que el arbol haga splits hasta
      que no pueda mas, pero que no caiga en bucle infinito
    ###
    W = 1920
    H = 1080
    MIN_W = W / 64
    MIN_H = H / 64
    quadTreeIndex.init(W, H, MIN_W, MIN_H)
    object = {data: "Complex"}
    i = 0
    while i < 50
      quadTreeIndex.put([1100, 500], 1, 1, object)
      i++

  xit "splits the correct number of nodes", ->
    W = 1920
    H = 1080
    MIN_W = W / 64
    MIN_H = H / 64
    quadTreeIndex.init(W, H, MIN_W, MIN_H)
    object = {data: "Complex"}
    i = 0
    while i < 50
      ### hay que tener cuidado con el ancho y el alto que se le da a los
      nodos porque sino pueden empezar a desplegar otros nodos de alrededor
      y ya no salen las cuentas ###
      quadTreeIndex.put([1100, 500], 1, 1, object)
      i++
    expect(quadTreeIndex.countObjects() ).toBe(50, "Objetos totales introducidos")
    ### ha desplegado todos los nodos posibles PERO EN UNA SOLA RAMA
    Eso hacen:
      1 del root
      4 del primer split (W = W0 / 2)
      4 del segundo split (W = W0 / 4)
      4 del tercer split (W = W0 / 8)
      4 del cuarto split (W = W0 / 16)
      4 del quinto split (W = W0 / 32)
      4 del sexto split (W = W0 / 64)
      TOTAL: 6 * 4 + 1 = 25
    ###
    expect(quadTreeIndex.countNodes() ).toBe(25, "Nodos totales generados")

    ### Expandir todos los nodos ###
    quadTreeIndex.clear()
    quadTreeIndex.init(W, H, MIN_W, MIN_H)
    object = {data: "Complex"}
    i = 0
    while i < 50
      ### El objeto esta superpuesto en todo el canvas, asi que colisiona
      con todos los nodos del arbol ###
      quadTreeIndex.put([0, 0], W, H, object)
      i++
    ### Si se desplegan todos los nodos el calculo es:

      1 del root
      4 del split 1
      16 del split 2
      32 del split 3
      256 del split 4
      1024 del split 5
      4096 del split 6

      TOTAL: 5461
    ###
    expect(quadTreeIndex.countNodes() ).toBe(5461, "Nodos totales generados")

  it "can find objects correctly", ->
    W = 1920
    H = 1080
    MIN_W = W / 64
    MIN_H = H / 64
    quadTreeIndex.init(W, H, MIN_W, MIN_H)

    printf = (str) ->
      args = [].slice.call(arguments, 1)
      i = 0

      interp = str.replace /%s/g, () ->
          return args[i++]

      console.log(interp)

    ## A: area ([100,100], [300,300])
    grupo_a_start = [100,100]
    grupo_a_end = [300,300]
    grupo_a = [
      {
        start: [100, 100],
        w: 50,
        h: 150, 
        object: {
          data: "A1"
        }
      },
      {
        start: [200, 100],
        w: 50,
        h: 50, 
        object: {
          data: "A2"
        }
      },
      {
        start: [150, 150],
        w: 50,
        h: 50, 
        object: {
          data: "A3"
        }
      },
    ]

    ## B: area ([301, 100], [500, 200])
    ## El area empieza en 301 porque el solapamiento es estricto.
    grupo_b_start = [301, 100]
    grupo_b_end = [500, 200]
    grupo_b = [
      {
        start: [301, 100],
        w: 10,
        h: 10,
        object: {
          data: "B1"
        }
      },
      {
        start: [400, 100],
        w: 100,
        h: 100,
        object: {
          data: "B2"
        }
      }
    ]

    for def in grupo_a
      quadTreeIndex.put(def.start, def.w, def.h, def.object)

    for def in grupo_b
      quadTreeIndex.put(def.start, def.w, def.h, def.object)

    ### prueba de grupo a ###
    printf("Pruebas grupo A")
    found_a = quadTreeIndex.getObjects(grupo_a_start, grupo_a_end)
    for found in found_a
      name = found.data
      msg = "Elemento " + name + " encontrado en el grupo A"
      expect(name[0]).toBe("A", msg)

    ### prueba de grupo a ###
    printf("Pruebas grupo B")
    found_b = quadTreeIndex.getObjects(grupo_b_start, grupo_b_end)
    for found in found_b
      name = found.data
      msg = "Elemento " + name + " encontrado en el grupo B"
      expect(name[0]).toBe("B", msg)












