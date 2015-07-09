'use strict';

var express = require('express');
var controller = require('./combate.controller');


var main_routes = expressRouter();

// Entregas / Deliverables
var deliverables_router = express.Router();

router.get('/', controller.deliverables.index);
router.get('/page/:page', controller.deliverables.index);
router.get('/:id', controller.deliverables.show);
router.post('/', controller.deliverables.create);
router.put('/:id', controller.deliverables.update);
router.patch('/:id', controller.deliverables.update);
router.delete('/:id', controller.deliverables.destroy);

main_routes.use("/deliverables", deliverables_router);
// FIN: Entregas / Deliverables

// Errores
router.get('/', controller.errors.index);
router.get('/page/:page', controller.errors.index);
router.get('/:id', controller.errors.show);
router.post('/', controller.errors.create);
router.put('/:id', controller.errors.update);
router.patch('/:id', controller.errors.update);
router.delete('/:id', controller.errors.destroy);
// FIN: Errores

module.exports = router;