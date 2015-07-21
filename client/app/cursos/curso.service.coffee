'use strict'

### Curso
 Servicio que proporciona acceso a la api del endpoint /api/cursos
###

angular.module 'pfcLaminasNodeApp'
.factory 'Curso', ($resource, $q, $http, $rootScope) ->

  ###
  Create new Curso

  @param {String} nombre
  @param {Integer} anyo
  @return {Promise}
  ###
  create: (curso) ->
    deferred = $q.defer()

    $http.post '/api/cursos',
      nombre: curso.nombre,
      anyo: curso.anyo
    .success (data) ->
      deferred.resolve(data)
    .error (err) ->
      deferred.reject(err)

    return deferred.promise

  uploadStudentsFile: (file) ->
    alert("TODO: upload students file");
