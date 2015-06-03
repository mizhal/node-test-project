'use strict';

var express = require('express');
var controller = require('./Usuario.controller');

var authService = require("../../auth/auth.service.js");

var router = express.Router();
router.use(authService.isAuthenticated());

router.get('/', controller.index);
router.get('/page/:page', controller.index);
router.get('/me', controller.me);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;