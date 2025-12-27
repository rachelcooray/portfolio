const { Pool } = require('pg');
require('dotenv').config();

console.log("DB_CONFIG: Host=localhost User=postgres DB=portfolio_db");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio_db',
  password: 'password',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
