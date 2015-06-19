'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'DashboardCtrl', ($scope) ->
  $scope.player = {
    photo: "assets/images/attached_files/DatosAlumno/foto/555ee0c43a9023fc8c6ec560.png",
    level: 12,
    experience: 12030,
    next_level_exp: 15000,
    progress_percent: 70,
    achievements: [
      {title: "Achievement1", image_url: "assets/images/attached_files/Achievement/image/001.png"},
      {title: "Achievement2", image_url: "assets/images/attached_files/Achievement/image/001.png"}
    ]
    name: "Luis Martinez Prada",
    life_points: 3012
  }

  $scope_progress_percent = $scope.player.progress_percent