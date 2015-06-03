'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', 
  passport.authenticate('local'),
  function(req, res) {
    var token = auth.signToken(req.user.id);
    res.json({ id: req.user.id, login: req.user.login, token: token});
  }
);

module.exports = router;