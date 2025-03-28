const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('PostgreSQL connection error', err);
    throw err;
  }
};

const query = (text, params) => pool.query(text, params);

const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  client.query = (...args) => {
    clearTimeout(timeout);
    return query.apply(client, args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

module.exports = { query, getClient, connectDB };