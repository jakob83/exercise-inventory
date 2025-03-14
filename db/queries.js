const pool = require('./pool');

async function getCompleteExercises() {
  const { rows } = await pool.query(
    `SELECT exercises.name AS exercise, equipment.name AS equipment, categories.name AS category FROM exercises JOIN categories ON categories.id = exercises.category_id JOIN
    exercises_equipment ON exercises.id = exercises_equipment.exercise_id JOIN equipment ON exercises_equipment.equipment_id = equipment.id;`
  );
  console.log(rows);
  return rows;
}

module.exports = { getCompleteExercises };
