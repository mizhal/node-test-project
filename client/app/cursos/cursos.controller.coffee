'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'CursosCtrl', ($scope, ngDialog, Curso) ->

  $scope.courses = []
  $scope.errors = {}
  $scope.current = {}

  class CursoObj
    constructor: (@name, @year) ->

  ### acciones de lista ###
  $scope.add = () ->
    $scope.current.dialog = ngDialog.open({ 
      template: 'app/cursos/curso_new.html',
      #className: 'ngdialog-theme-plain',
      scope: $scope
    })
    $scope.current["new_course"] = new CursoObj()

  $scope.upload = () ->
    $scope.current.dialog = ngDialog.open({ 
      template: 'app/cursos/curso_upload.html',
      #className: 'ngdialog-theme-plain',
      scope: $scope
    })
    $scope.current["new_course"] = new CursoObj()  
  ### FIN: acciones de lista ###

  ### formularios ###
  $scope.submit_new_course = (form) ->
    if form.$valid
      Curso.create
        nombre: $scope.current.new_course.name,
        year: $scope.current.new_course.year
      .then (data) ->
        $scope.current.dialog.close()
      .catch (err) ->
        $scope.errors.other = err.message

  $scope.upload_course_data = (form) ->
    if form.$valid
      Curso.uploadStudentsFile(form.file)
      
  ### FIN: formularios ###
