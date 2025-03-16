require('dotenv').config();
const insertDummyData = require('./insertDummyData');
const populateDb = require('./populate');
const { Client } = require('pg');
const SQL = `
DROP TABLE exercises;
DROP TABLE equipment;
DROP TABLE exercises_equipment;
DROP TABLE categories;
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
    console.log('Reset sucessful!');
  } catch (err) {
    console.error('Error during the query execution:', err);
  } finally {
    await client.end();
    console.log('done');
  }
}
async function reset() {
  await main();
  await populateDb();
  await insertDummyData();
}
reset();
