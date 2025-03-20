const pool = require('./pool');

async function getCompleteExercises() {
  const { rows } = await pool.query(
    `SELECT exercises.id AS exercise_id, exercises.name AS exercise, equipment.name AS equipment, categories.name AS category, img FROM exercises JOIN categories ON categories.id = exercises.category_id JOIN
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
async function insertExercise(exercise, category, equipmentArr, imgUrl) {
  const catId = await pool.query(
    `SELECT id FROM categories WHERE name ILIKE('${category}')`
  );

  const exId = await pool.query(
    'INSERT INTO exercises (name, category_id, img ) VALUES ($1, $2, $3) RETURNING id',
    [exercise, catId.rows[0].id, imgUrl]
  );

  for (let i = 0; i < equipmentArr.length; i++) {
    const equipment = equipmentArr[i];
    const eqId = await pool.query(
      `SELECT id FROM equipment WHERE name = '${equipment}'`
    );
    await pool.query(
      `INSERT INTO exercises_equipment (exercise_id, equipment_id) VALUES ($1, $2)`,
      [exId.rows[0].id, eqId.rows[0].id]
    );
  }
}

async function insertEquipment(equipment) {
  await pool.query(`INSERT INTO equipment (name) VALUES ($1)`, [equipment]);
}

async function getExerciseById(id) {
  const { rows } = await pool.query(
    'SELECT img, exercises.name AS exercise, categories.name AS category, exercises.id AS exercise_id FROM exercises JOIN categories ON categories.id = exercises.category_id WHERE exercises.id = $1 ',
    [id]
  );
  return rows[0];
}

async function replaceExercise(id, exercise, category, equipmentArr, imgUrl) {
  const catId = await pool.query(
    `SELECT id FROM categories WHERE name ILIKE('${category}')`
  );

  await pool.query(
    `
        UPDATE exercises 
        SET 
          name = $1, 
          category_id = $2, 
          img = $3
        WHERE id = $4;
      `,
    [
      exercise, // New exercise name
      catId.rows[0].id, // New category_id
      imgUrl, // New image URL
      id, // Exercise ID (the one i want to update)
    ]
  );
  await pool.query(`DELETE FROM exercises_equipment WHERE exercise_id = $1`, [
    id,
  ]);

  for (let i = 0; i < equipmentArr.length; i++) {
    const equipment = equipmentArr[i];
    console.log('eq in loop:' + equipment);
    const eqId = await pool.query(
      `SELECT id FROM equipment WHERE name = '${equipment}'`
    );
    await pool.query(
      `INSERT INTO exercises_equipment (exercise_id, equipment_id) VALUES ($1, $2)`,
      [id, eqId.rows[0].id]
    );
  }
}

module.exports = {
  getCompleteExercises,
  getCategories,
  getEquipment,
  insertExercise,
  insertEquipment,
  getExerciseById,
  replaceExercise,
};
