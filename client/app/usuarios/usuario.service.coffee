# Resource Usuario

angular.module "pfcLaminasNodeApp"
.factory "Usuario", ($resource) ->
  $resource '/api/auth/usuarios/:id',
    null,
    { 
      all: { method: "GET" },
      get: { method: "GET", id: '@id'},
    }
.factory "Role", ($resource) ->
  $resource "/api/auth/roles/:id",
    null,
    {
      all: {
        method: "GET"
      },
      get: {
        method: "GET",
        id: "@id"
      }
    }


      