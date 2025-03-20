const { body, validationResult } = require('express-validator');
const queries = require('../db/queries');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file types
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) are allowed!'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});
exports.exercisesGET = async (req, res) => {
  const rows = await queries.getCompleteExercises();
  let exercises = [];
  rows.forEach((row) => {
    if (
      exercises[0] &&
      exercises[exercises.length - 1].exercise === row.exercise
    ) {
      exercises[exercises.length - 1].equipment.push(row.equipment);
    } else {
      exercises.push({
        id: row.exercise_id,
        exercise: row.exercise,
        category: row.category,
        img: row.img,
        equipment: [row.equipment],
      });
    }
  });
  res.render('exercises/exercises', { exercises: exercises });
};

exports.exerciseNewGET = async (req, res) => {
  const catRows = await queries.getCategories();
  const eqRows = await queries.getEquipment();
  if (req.query.err) {
    res.render('exercises/new', {
      categories: catRows,
      equipment: eqRows,
      err: req.query.err,
    });
  }
  res.render('exercises/new', { categories: catRows, equipment: eqRows });
};

// Error Handling needed:
exports.exerciseNewPOST = [
  upload.single('img'),
  (req, res, next) => {
    const { exercise, category, equipment } = req.body;
    console.log(req.body);
    if (!Array.isArray(equipment)) {
      req.body.equipment = [equipment];
      console.log(req.body);
    }
    if (!exercise || !category || equipment.length === 0) {
      return next(new Error('Please enter all the information'));
    } else if (!req.file) {
      return next(new Error('Please upload an image.'));
    }

    next();
  },
  async (req, res, next) => {
    const { exercise, category, equipment } = req.body;
    try {
      await queries.insertExercise(
        exercise,
        category,
        equipment,
        '/uploads/' + req.file.filename
      );
      res.redirect('/exercises');
    } catch (err) {
      next(err);
    }
  },
  (err, req, res, next) => {
    console.log(err);
    res.redirect(`/exercises/new?err=${err.message}`);
  },
];

exports.exerciseUpdateGET = async (req, res) => {
  const { id } = req.params;
  const exercise = await queries.getExerciseById(id);
  const catRows = await queries.getCategories();
  const eqRows = await queries.getEquipment();

  res.render('exercises/update', {
    exercise: exercise,
    categories: catRows,
    equipment: eqRows,
  });
};

exports.exerciseUpdatePOST = [
  upload.single('img'),
  (req, res, next) => {
    const { equipment } = req.body;
    if (!Array.isArray(equipment)) {
      req.body.equipment = [equipment];
    }
    next();
  },
  async (req, res) => {
    const { exercise, category, equipment } = req.body;
    const { id } = req.params;
    const exerciseOld = await queries.getExerciseById(id);
    let imgUrl = exerciseOld.img;
    if (req.file) {
      imgUrl = '/uploads/' + req.file.filename;
    }
    console.log(imgUrl);

    queries.replaceExercise(id, exercise, category, equipment, imgUrl);
    res.redirect('/exercises');
  },
];
