/**
  Modulo slugger
    Funcionalidad auxilar para generacion de slugs en las entidades.

  Los slugs son identificadores unicos de objetos. Son cadenas normalizadas 
  (sin caracteres especiales) generadas a partir de algun datos del objeto.
  Son utiles para:
    - urls facilmente reconocibles.
    - depuracion y logging de errores.
**/

var slug_lib = require('slug');
var Promise = require('bluebird');

/***
  Funcion "generator"

  @param instance 
    fila/objeto concreta que contiene el slug
  @param Model 
    tipo de datos/tabla/modelo
  @param source_value 
    texto que se usara para generar el slug
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
  source_value, 
  slug_field_name, 
  slug_field_size,
  repeats
){
  if (instance[slug_field_name]) {
    // ya hay slug. Se conserva
    return;

  } else if (source_value) {
    // generar el slug en bruto
    var slug = slug_lib(source_value);
  } else {
    // no hay datos fuente, no se genera nada y probablemente
    // falle en las validaciones.
    return;
  }
    
  // contador de repeticiones por si ya existe el slug en BD
  var repeats_length = null;
  if(repeats == null)
    repeats_length = 0
  else
    repeats_length = repeats.length;

  // limitar el tamanyo
  if(slug.length + repeats_length > slug_field_size) {
    slug = slug.slice(0, slug_field_size - repeats_length - 1);
  }

  // si estamos en repeticion, concatenar el numero de repeticion
  if(repeats != null)
    slug += "-" + repeats;

  // check slug duplicado en BD
  return Model.count({

      where:{slug: slug}

    }).then(function(count){

      if(repeats == null) repeats = 0; //repeticion inicial

      if(count > 0){

        // llamada recursiva, 
        // porque el check de duplicado es asincrono
        // no se puede hacer iterativa
        // la llamada recursiva causa un encadenamiento de
        // promesas.
        return generator(instance, Model, source_value,
          slug_field_name, slug_field_size, repeats + 1);

      } else {

        // si todo va bien, se asigna definitivamente el campo
        instance[slug_field_name] = slug;

      }
    });
}

module.exports = {
  generator: generator
};