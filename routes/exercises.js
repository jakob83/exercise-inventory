const { Router } = require('express');
const exerciseController = require('../controllers/exerciseController');
const exercisesRouter = new Router();

exercisesRouter.get('/', exerciseController.exercisesGET);

exercisesRouter.get('/new', exerciseController.exerciseNewGET);

module.exports = exercisesRouter;
