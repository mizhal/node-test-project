### Error Resource ###

angular.module "alcahest"
.factory "Error", () ->
  $resource "/api/deliverables/:id/errors/:controller",
    id: "@_id"
  ,
    all: 
      method: "GET"
