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

  ## CALENDARIO
  $scope.calendar = DashCalendar
  $scope.current_month = 6
  $scope.current_month_name = "CAL_JUNE"
  $scope.calendar = DashCalendar.getDayArray(6, 2015)
  $scope.daynames = ["L", "M", "X", "J", "V", "S", "D"]
  ## FIN: CALENDARIO

  ## ENTREGAS/DELIVERABLES
  $scope.deliverables_log = [
    {
      name: "Pendientes",
      items: [
        {
          title: "Lámina Ronda #3",
          icon_type: "LAMINA",
          url: "/upload/deliverable/123121"
        },
        {
          title: "Lámina Ronda Especial 'Navidad'",
          icon_type: "LAMINA_ESPECIAL",
          url: "/upload/deliverable/123122"
        },        
      ]
    },
    {
      name: "Reclamadas",
      items: [
        {
          title: "Lámina Ronda Especial 'Otoño' (2 errores)",
          icon_type: "LAMINA_ESPECIAL_RECLAMADA",
          url: "/editor/234121"
        },
        {
          title: "Lámina Competición #1 (5 errores)",
          icon_type: "LAMINA_COMPETICION_RECLAMADA",
          url: "/editor/234121"          
        }
      ]
    },
    {
      name: "Completas",
      items: [
        {
          title: "Lámina Ronda #1",
          icon_type: "LAMINA",
          url: "/editor/2341"   
        },
        {
          title: "Lámina Ronda #2",
          icon_type: "LAMINA",
          url: "/editor/21"   
        }
      ]
    }
  ]
  ## FIN: ENTREGAS/DELIVERABLES 