###
  Vectors 

  Operaciones para vectores 2D
###

angular.module "alcahest"
.factory "Vector2D", () ->
  class Vector2D
    sum: (vec2D1, vec2D2) ->
      return [vec2D1[0] + vec2D2[0], vec2D1[1] + vec2D2[1]]

    dif: (vec2D1, vec2D2) ->
      return [vec2D1[0] - vec2D2[0], vec2D1[1] - vec2D2[1]]

    inv: (vec2D1, vec2D2) ->
      return [ - vec2D1[0] , - vec2D1[1]]

    scale: (scale, vec2D) ->
      return [scale * vec2D[0], scale * vec2D[1]]

    print: (vec2D) ->
      console.log("<%s, %s>", vec2D[0], vec2D[1])

    set: (vec2D, x, y) ->
      vec2D[0] = x
      vec2D[1] = y

    norm: (vec2D) ->
      return Math.sqrt(vec2D[0] * vec2D[0] + vec2D[1] * vec2D[1])

    dist: (vec2D_start, vec2D_end) ->
      d_x = vec2D_end[0] - vec2D_start[0]
      d_y = vec2D_end[1] - vec2D_start[1]
      return Math.sqrt(d_x * d_x + d_y * d_y)

  return new Vector2D()