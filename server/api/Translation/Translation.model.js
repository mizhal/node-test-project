'use strict';

var Sequelize = require('sequelize');
var sequelize = require("../../components/sequelize_singleton");

var Translation = sequelize.define("Translation",{
  key: Sequelize.STRING,
  language: Sequelize.STRING,
  view: Sequelize.STRING,
  value: Sequelize.STRING  
});

module.exports = Translation;