require('dotenv').config();
const express = require('express');
const path = require('node:path');
const indexRouter = require('./routes/index');
const exercisesRouter = require('./routes/exercises');
const app = express();

// setup, so that node/express knows, where the views folder is
app.set('views', path.join(__dirname, 'views'));
// and that the views folder holds .ejs files
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// For images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/exercises', exercisesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('listening on ' + PORT);
});
