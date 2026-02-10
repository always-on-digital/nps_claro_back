const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Página inicial — verifica conexão com o banco
router.get('/', async (req, res) => {
  let dbStatus = { connected: false, message: '' };

  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    dbStatus.connected = true;
    dbStatus.message = `Conectado — ${result.rows[0].current_time}`;
  } catch (err) {
    dbStatus.message = `Erro: ${err.message}`;
  }

  res.render('index', { title: 'NPS Claro', dbStatus });
});

module.exports = router;

// ============================================================
// Rotas de banco de dados
// ============================================================

// GET /api/schemas
router.get('/schemas', async (req, res) => {
  try {
    const query = `
      SELECT t.table_schema AS schema, t.table_name AS table_name, t.table_type AS table_type
      FROM information_schema.tables t
      WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY t.table_schema, t.table_name`;
    const result = await pool.query(query);
    const schemas = {};
    result.rows.forEach((row) => {
      if (!schemas[row.schema]) schemas[row.schema] = [];
      schemas[row.schema].push({ name: row.table_name, type: row.table_type });
    });
    res.json({ success: true, schemas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/procedures
router.get('/procedures', async (req, res) => {
  try {
    const query = `
      SELECT r.routine_schema AS schema, r.routine_name AS name
      FROM information_schema.routines r
      WHERE r.routine_type = 'PROCEDURE'
        AND r.routine_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY r.routine_schema, r.routine_name`;
    const result = await pool.query(query);
    const schemas = {};
    result.rows.forEach((row) => {
      if (!schemas[row.schema]) schemas[row.schema] = [];
      schemas[row.schema].push(row.name);
    });
    res.json({ success: true, schemas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/functions
router.get('/functions', async (req, res) => {
  try {
    const query = `
      SELECT r.routine_schema AS schema, r.routine_name AS name
      FROM information_schema.routines r
      WHERE r.routine_type = 'FUNCTION'
        AND r.routine_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY r.routine_schema, r.routine_name`;
    const result = await pool.query(query);
    const schemas = {};
    result.rows.forEach((row) => {
      if (!schemas[row.schema]) schemas[row.schema] = [];
      schemas[row.schema].push(row.name);
    });
    res.json({ success: true, schemas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
