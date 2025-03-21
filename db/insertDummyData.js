require('dotenv').config();

const { Client } = require('pg');
const SQL = `
INSERT INTO exercises (name, category_id, img)
VALUES
('Push Ups', (SELECT id FROM categories WHERE name = 'Upper Body'), '/uploads/pushup.jpg'),
('Pull Ups', (SELECT id FROM categories WHERE name = 'Upper Body'), '/uploads/pullup.jpg'),
('Running', (SELECT id FROM categories WHERE name = 'Cardiovascular'), '/uploads/running.jpg'),
('Squats', (SELECT id FROM categories WHERE name = 'Lower Body'), '/uploads/squat.jpg'),
('Burpees', (SELECT id FROM categories WHERE name = 'Full Body'), '/uploads/burpee.jpg'),
('Russian Twists', (SELECT id FROM categories WHERE name = 'Core / Abdominal'), '/uploads/twist.jpg');

INSERT INTO equipment (name)
VALUES
('Bodyweight'),
('Weights'),
('Barbell'),
('Dumbbell'),
('Bench');
`;

const SQL_equipment_exercises = `
INSERT INTO exercises_equipment (exercise_id, equipment_id)
VALUES
((SELECT id FROM exercises WHERE name = 'Push Ups'), (SELECT id FROM equipment WHERE name = 'Bodyweight')),
((SELECT id FROM exercises WHERE name = 'Pull Ups'), (SELECT id FROM equipment WHERE name = 'Bodyweight')),
((SELECT id FROM exercises WHERE name = 'Running'), (SELECT id FROM equipment WHERE name = 'Bodyweight')),
((SELECT id FROM exercises WHERE name = 'Squats'), (SELECT id FROM equipment WHERE name = 'Weights')),
((SELECT id FROM exercises WHERE name = 'Squats'), (SELECT id FROM equipment WHERE name = 'Barbell')),
((SELECT id FROM exercises WHERE name = 'Burpees'), (SELECT id FROM equipment WHERE name = 'Bodyweight')),
((SELECT id FROM exercises WHERE name = 'Russian Twists'), (SELECT id FROM equipment WHERE name = 'Bodyweight'));
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Connection successful!');
    await client.query(SQL);
    console.log('Query 1 successful!');
    await client.query(SQL_equipment_exercises);
    console.log('Query 2 successful!');
  } catch (err) {
    console.error('Error during the query execution:', err);
  } finally {
    await client.end();
    console.log('done');
  }
}
main();
module.exports = main;
