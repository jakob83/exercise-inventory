const pool = require('./pool');

async function getCompleteExercises() {
  const { rows } = await pool.query(
    `SELECT exercises.name AS exercise, equipment.name AS equipment, categories.name AS category, img FROM exercises JOIN categories ON categories.id = exercises.category_id JOIN
    exercises_equipment ON exercises.id = exercises_equipment.exercise_id JOIN equipment ON exercises_equipment.equipment_id = equipment.id;`
  );
  return rows;
}

async function getCategories() {
  const { rows } = await pool.query(`SELECT name FROM categories;`);
  return rows;
}
async function getEquipment() {
  const { rows } = await pool.query(`SELECT name FROM equipment;`);
  return rows;
}

module.exports = { getCompleteExercises, getCategories, getEquipment };
