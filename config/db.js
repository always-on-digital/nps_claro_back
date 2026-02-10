const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false },
});

// Define o schema padrão em cada nova conexão
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${process.env.DB_SCHEMA}, public`);
});

module.exports = pool;

