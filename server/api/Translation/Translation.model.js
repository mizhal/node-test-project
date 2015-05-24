'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TranslationSchema = new Schema({
  key: String,
  language: String,
  view: String,
  value: String
});

module.exports = mongoose.model('Translation', TranslationSchema);