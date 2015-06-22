'use strict'

angular.module 'pfcLaminasNodeApp'
.controller 'DashboardCtrl', ($scope, $q, DashCalendar, $translatePartialLoader, $translate) ->

  ## TRADUCCIONES
  $translatePartialLoader.addPart 'dashboard_player'
  $translate.refresh()
  ## FIN: TRADUCCIONES

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
      is_open: true,
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
      is_open: false,
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
      is_open: false,
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

  ## TAREAS DE CORRECCION
  $scope.tasks_log = [
    {
      name: "Pendientes",
      is_open: true,
      items: [
        {
          title: "Corrección lámina #2312 (para 23/7/2015)",
          icon_type: "TAREA",
          url: "/editor/21"   
        },
        {
          title: "Corrección lámina #2313 (para 23/7/2015)",
          icon_type: "TAREA",
          url: "/editor/22"   
        },
        {
          title: "Corrección lámina #2322 (para 23/7/2015)",
          icon_type: "TAREA",
          url: "/editor/32"   
        }
      ]
    },
    {
      name: "Completas",
      is_open: false,
      items: [
        {
          title: "Corrección lámina #2301 (para 23/7/2015)",
          icon_type: "TAREA",
          url: "/editor/2"   
        },
        {
          title: "Corrección lámina #2302 (para 23/7/2015)",
          icon_type: "TAREA",
          url: "/editor/12"   
        }
      ]
    }
  ]
  ## FIN: TAREAS DE CORRECCION