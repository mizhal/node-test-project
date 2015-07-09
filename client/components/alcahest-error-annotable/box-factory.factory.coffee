angular.module "alcahest"
.factory "BoxFactory", () ->
  ### CONSTANTES DE COORDENADAS ###
  X = 0
  Y = 1
  ### FIN: CONSTANTES DE COORDENADAS ###

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
  ### FIN: Class Box ###

  ### class BoxFactory ###
  class BoxFactory
    create: (A, B, C, D) ->
      return new Box(A, B, C, D)
  ### FIN: class BoxFactory ###

  return (new BoxFactory())