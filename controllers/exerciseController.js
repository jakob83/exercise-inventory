const { body, validationResult } = require('express-validator');
const querys = require('../db/queries');

exports.usersListGET = async (req, res) => {
  const rows = await querys.getCompleteExercises();
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
