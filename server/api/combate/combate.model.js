'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

/*** MODELO DEL PAQUETE DE COMBATE **/

// doc: http://docs.sequelizejs.com/en/latest/docs/models-definition/
var Ronda = sequelize.define('Ronda', {});
var Entrega = sequelize.define("Entrega",{});
var Reparto = sequelize.define("Reparto",{});
var Tarea = sequelize.define("Tarea", {});
var Jugador = {}; //no persistentes
var Retador = {};
var Error = sequelize.define("Error", {}); //incluye los campos de reclamacion.
var CategoriaError = sequelize.define("CategoriaError", {});

Ronda.hasMany(Entrega, {as: "entregas"});
Entrega.belongsTo(Ronda, {as: "ronda"});
Ronda.hasMany(Reparto, {as: "repartos"});
Reparto.belongsTo(Ronda, {as: "ronda"});
Reparto.hasMany(Tarea, {as: "tareas"});
Tarea.belongsTo(Reparto, {as: "reparto"});
Tarea.hasOne(Entrega, {as: "entrega"});
Entrega.hasMany(Error, {as: "errores"});
Error.belongsTo(CategoriaError, {as: "categoria"});
CategoriaError.hasMany(Error, {as: "errores"});

var CombateFacade = {
  crearRonda: function(){

  },
  subirEntrega: function(id_usuario /* :Integer */, id_ronda /* :Entrega */, 
      req_files /** multer object*/){
    /** Funcion auxiliar para almacenar una entrega en el sistema 
      Debe desencadenar el Reparto y la generación de Tareas/Correcciones
      en cuanto se cumpla la condicion de entregas suficientes.
      Probablemente sea una tarea en cron o algo asi.
      Tambien emite notificaciones que deben enviarse a los usuarios implicados.
    **/
  },
  estadoDeEntregas: function(id_usuario /* :Integer */){
    /** Esta funcion retorna un hash anidado con la lista de entregas pendientes,
     completadas y reclamadas
    **/
  },
  verEntrega: function(id_entrega /* :Integer */){
    /** Funcion usada para cargar los datos de una entrega en el Editor.
      contiene los errores y los datos de la entrega 
      {
        entrega: {
          autor: "xxxx",
          ronda: "xxx",
          fecha_subida: "",
          ...,
          errores: [
            {id: 23, categoria: <slug_de_categoria>, ...}
            ...
          ]
        },
        metadatos: { //se envian los datos de las "tablas dimensionales" para evitar cargarlo otra vez
          // es como si fuera la "leyenda de un mapa"
          categorias: [
            slug_categoria: {nombre:"xxx", id:324, slug}
          ]
        }
      }
    **/
  },
  anotarError: function(id_entrega /** :Integer */, datos_error /** :Hash(Error) */){
    /** Graba un error en una entrega **/
  },
  borrarError: function(id_error /** :Integer */){
    /** Borra un error de la base de datos **/
  },
  confirmarCorreccion: function(id_entrega /** :Integer */){
    /** Cierra la correccion de una Entrega fijando los errores almacenados */
  },
  reclamarError: function(id_error /** :Integer */, datos_reclamacion /** :Hash(Reclamacion) */){
    /** Graba una reclamación en un error **/
  },
  verReclamaciones: function(id_usuario /** :Integer */){
    /** Para el profesor/corrector, enumera las reclamaciones agrupadas por estado */
  },
  resolverReclamacion: function(id_error /** :Integer */, 
    datos_reclamacion /* :Hash(Reclamacion) */){
    /** Modifica el estado de la reclamacion y anota la resolucion dada */
  },
  listarCategoriasNivel1: function(){
    /** Envia un listado de los slugs de las categorias de nivel1 **/
  },
  defineOActualizaCategoria: function(datos_categoria /* :Hash(CategoriaError) */){
    /** Crea una categoria con sus datos asociados */
  }
};

module.exports = CombateFacade;