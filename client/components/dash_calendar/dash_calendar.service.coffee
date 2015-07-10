#Calendar service

angular.module 'pfcLaminasNodeApp'
.factory 'DashCalendar', ($resource) ->
  service =
    daysToMilliseconds: (days) ->
      return days*24*60*60*1000

    getDayArray: (month, year) ->
      # Tres arrays de días que corresponden a los dias visibles del mes anterior,
      # los dias del mes actual y
      # los dias visibles del mes que viene

      # en javascript, el dia 0 de un mes es el ultimo dia del mes anterior.
      prev_month_last_day = new Date(year, month - 1, 0);
      current_month_first_day = new Date(year, month - 1, 1);
      current_month_last_day = new Date(year, month, 0);
      week_day = current_month_first_day.getDay()

      if week_day <= 1 #lunes
        week_day = 6 + week_day
      if week_day > 1
        week_day = week_day - 1
      week_day2 = current_month_last_day.getDay()
      if week_day2 == 0 # domingo
        week_day2 = 7
      return {
        prev_days: (prev_month_last_day.getDate() - j for j in [week_day..0]),
        current_days: (j for j in [1..current_month_last_day.getDate()]),
        next_days: (j for j in [1..(7 - week_day2)])
      }