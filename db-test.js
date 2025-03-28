require('dotenv').config();
const { Pool } = require('pg');

console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT)
});

pool.query('SELECT NOW()')
  .then(res => console.log('Database connected:', res.rows[0]))
  .catch(err => console.error('Connection failed:', err));