/**
  Modulo slugger
    Funcionalidad auxilar para generacion de slugs en las entidades.
**/

var slug_lib = require('slug');
var Promise = require('bluebird');

/***
  Funcion "generator"

  @param instance 
    fila/objeto concreta que contiene el slug
  @param Model 
    tipo de datos/tabla/modelo
  @param slug_source_fields_callback 
    Callback/lambda/funcion que devuelve la cadena que se usa para calcular el slug, por ejemplo
    se puede usar la suma de otros campos o formulas mas complejas como
      function(){
        if(curso.anyo < 2011)
          return curso.nombre + "antiguo"
        else
          return curso.nombre + "-" + curso.anyo
      }
  @param slug_field_name 
    Nombre del campo que contiene el slug en la base de datos
  @param slug_field_size 
    Tamanyo del campo que contiene el slug en la base de datos
  @param repeats 
    contador recursivo
**/
var generator = function(
  instance, // fila concreta que contiene el slug
  Model, // tipo de datos/tabla/modelo
  slug_source_fields_callback, 
  slug_field_name, 
  slug_field_size,
  repeats
){
  var source = slug_source_fields_callback();
  if(repeats == null) {
    repeats = "";
  }

  if(source) {
    slug = slug_lib(source);
    if(slug.length + repeats.length > slug_field_size) {
      slug = slug.slice(0, slug_field_size - repeats.length - 1);
    }
    slug += repeats;
    // check duplicado
    return Model.count({
        where:{slug: slug}
      }).then(function(count){
        if(repeats == "") repeats = 0;
        if(count > 0){
          return generator(instance, Model, slug_source_fields_callback,
            slug_field_name, slug_field_size, repeats + 1);
        } else {
          instance[slug_field_name] = slug;
        }
      });
  }
}

module.exports = {
  generator: generator
};