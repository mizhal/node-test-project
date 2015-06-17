'use strict';

var express = require('express');
var controller = require('./Usuario.controller');

var authService = require("../../auth/auth.service.js");

var router = express.Router();
router.use(authService.isAuthenticated());

router.get('/usuarios/', controller.index);
router.get('/usuarios/page/:page', controller.index);
router.get('/usuarios/me', controller.me);
router.get('/usuarios/:id', controller.show);
router.post('/usuarios/', controller.create);
router.put('/usuarios/:id', controller.update);
router.patch('/usuarios/:id', controller.update);
router.delete('/usuarios/:id', controller.destroy);

router.get('/roles/', controller.index_roles);
router.get('/roles/page/:page', controller.index_roles);
router.get('/roles/:id', controller.show_roles);
router.post('/roles/', controller.create_roles);
router.put('/roles/:id', controller.update_roles);
router.patch('/roles/:id', controller.update_roles);
router.delete('/roles/:id', controller.destroy_roles);

module.exports = router;