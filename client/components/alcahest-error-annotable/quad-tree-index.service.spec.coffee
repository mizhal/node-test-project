## Spec
'use strict'

describe 'Service: quadTreeIndex', ->

  # load the service's module
  beforeEach module 'pfcLaminasNodeApp'

  # instantiate service
  quadTreeIndex = undefined
  beforeEach inject (_quadTreeIndex_) ->
    quadTreeIndex = _quadTreeIndex_

  it 'should init', ->
    quadTreeIndex.init(1024, 1024)
    quadTreeIndex.width.should.beEqual(1024)