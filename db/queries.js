const pool = require('./pool');

async function getCompleteExercises() {
  const { rows } = await pool.query(
    'SELECT exercises.id AS e_id, exercises.name AS exercise, categories.name AS category, category_id AS c_id FROM exercises JOIN categories ON exercises.category_id = categories.id'
  );
  console.log(rows);
  return rows;
}

module.exports = { getCompleteExercises };
