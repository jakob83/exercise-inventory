const { Router } = require('express');

const indexRouter = new Router();

indexRouter.get('/', (req, res) => {
  res.render('home');
});

module.exports = indexRouter;
