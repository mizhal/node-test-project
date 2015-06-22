'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'DashboardCtrl', ($scope, $q, DashCalendar) ->
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

  $scope.calendar = DashCalendar
  $scope.current_month = 6
  $scope.current_month_name = "CAL_JUNE"
  $scope.calendar = DashCalendar.getDayArray(6, 2015)
  $scope.daynames = ["L", "M", "X", "J", "V", "S", "D"]