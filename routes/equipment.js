const { Router } = require('express');
const equipmentController = require('../controllers/equipmentController');
const equipmentRouter = new Router();

equipmentRouter.get('/', equipmentController.equipmentGET);
equipmentRouter.get('/new', equipmentController.equipmentNewGET);
equipmentRouter.post('/new', equipmentController.equipmentNewPOST);

module.exports = equipmentRouter;
