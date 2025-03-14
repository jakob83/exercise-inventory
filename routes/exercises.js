const { Router } = require('express');
const exerciseController = require('../controllers/exerciseController');
const exercisesRouter = new Router();

exercisesRouter.get('/', exerciseController.usersListGET);

module.exports = exercisesRouter;
