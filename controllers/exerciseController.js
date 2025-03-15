const { body, validationResult } = require('express-validator');
const queries = require('../db/queries');

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
