const { Router } = require('express');
const exerciseController = require('../controllers/exerciseController');
const exercisesRouter = new Router();

exercisesRouter.get('/', exerciseController.exercisesGET);

exercisesRouter.get('/new', exerciseController.exerciseNewGET);

exercisesRouter.post('/new', exerciseController.exerciseNewPOST);
module.exports = exercisesRouter;
