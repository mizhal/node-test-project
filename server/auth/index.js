'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Usuario = require('../api/Usuario/Usuario.model');

// Passport Configuration
require('./local/passport').setup(Usuario, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;