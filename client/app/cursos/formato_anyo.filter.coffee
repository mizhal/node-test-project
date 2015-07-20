angular.module 'pfcLaminasNodeApp'
  .filter "formato_anyo", () ->
    return (value) ->
      return "#{value} / #{value + 1}"