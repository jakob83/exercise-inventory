const { body, validationResult } = require('express-validator');
const queries = require('../db/queries');
const path = require('path');
const multer = require('multer');
const e = require('express');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

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
        exercise: row.exercise,
        category: row.category,
        img: row.img,
        equipment: [row.equipment],
      });
    }
  });
  res.render('exercises', { exercises: exercises });
};

exports.exerciseNewGET = async (req, res) => {
  const catRows = await queries.getCategories();
  const eqRows = await queries.getEquipment();
  res.render('new', { categories: catRows, equipment: eqRows });
};

// Error Handling needed:
exports.exerciseNewPOST = [
  upload.single('img'),
  async (req, res) => {
    const { exercise, category, equipment } = req.body;
    await queries.insertExercise(
      exercise,
      category,
      equipment,
      '/uploads/' + req.file.filename
    );
    res.redirect('/exercises');
  },
];
