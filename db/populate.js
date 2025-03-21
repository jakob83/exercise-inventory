require('dotenv').config();
const { Client } = require('pg');
const SQL = `
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    category_id INTEGER,
    img TEXT
);

CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS exercises_equipment (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    exercise_id INTEGER,
    equipment_id INTEGER
);

INSERT INTO categories (name)
VALUES
('Upper Body'),
('Lower Body'),
('Core / Abdominal'),
('Full Body'),
('Cardiovascular');
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Connection successful!');

    console.log('populating...');
    await client.query(SQL);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error during the query execution:', err);
  } finally {
    await client.end();
    console.log('done');
  }
}
main();
module.exports = main;
