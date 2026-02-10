const pool = require('./db');

// Mapa: nome_routine → schema qualificado (ex: "fc_cliente" → "raw_data.fc_cliente")
const registry = {
  functions: {},   // { fc_cliente: "raw_data", fc_produto: "raw_data", ... }
  procedures: {},  // { pr_exemplo: "results", ... }
};

let loaded = false;

/**
 * Carrega todas as functions e procedures do banco e monta o mapa nome → schema.
 * Chamado uma vez na inicialização do servidor.
 */
async function load() {
  try {
    const result = await pool.query(`
      SELECT
        r.routine_schema AS schema,
        r.routine_name   AS name,
        r.routine_type   AS type
      FROM information_schema.routines r
      WHERE r.routine_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY r.routine_schema, r.routine_name
    `);

    result.rows.forEach((row) => {
      const target = row.type === 'FUNCTION' ? registry.functions : registry.procedures;
      // Se houver duplicata em schemas diferentes, mantém a primeira encontrada
      if (!target[row.name]) {
        target[row.name] = row.schema;
      }
    });

    loaded = true;
    const totalFn = Object.keys(registry.functions).length;
    const totalPr = Object.keys(registry.procedures).length;
    console.log(`[RoutineRegistry] Carregado: ${totalFn} functions, ${totalPr} procedures`);
  } catch (err) {
    console.error('[RoutineRegistry] Erro ao carregar:', err.message);
  }
}

/**
 * Resolve o nome qualificado de uma function.
 * Ex: resolve('function', 'fc_cliente') → 'raw_data.fc_cliente'
 * Se não encontrar, retorna o nome original (sem schema).
 */
function resolve(type, name) {
  // Se já veio qualificado (ex: "raw_data.fc_cliente"), retorna como está
  if (name.includes('.')) return name;

  const map = type === 'function' ? registry.functions : registry.procedures;
  const schema = map[name];
  return schema ? `${schema}.${name}` : name;
}

/**
 * Retorna true se o registry já foi carregado.
 */
function isLoaded() {
  return loaded;
}

/**
 * Força recarga do registry (útil se criar novas functions/procedures em runtime).
 */
async function reload() {
  registry.functions = {};
  registry.procedures = {};
  loaded = false;
  await load();
}

module.exports = { load, resolve, isLoaded, reload, registry };

