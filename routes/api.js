const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const routineRegistry = require('../config/routineRegistry');

// ============================================================
// Middleware de resposta padronizada
// ============================================================
function formatResponse(res, { sucesso, mensagem, procedure, resultado, registrosAfetados, tempoMs }) {
  const status = sucesso ? 200 : 500;
  return res.status(status).json({
    sucesso,
    mensagem,
    procedure,
    dados: sucesso ? { resultado, registrosAfetados, tempoMs } : null,
  });
}

function formatValidationError(res, mensagem, procedure) {
  return res.status(400).json({
    sucesso: false,
    mensagem,
    procedure: procedure || null,
    dados: null,
  });
}

function deriveCategoria(nps_score) {
  if (nps_score >= 9) return "Promotor";
  if (nps_score >= 7) return "Neutro";
  return "Detrator";
}

function deriveTipo(is_respondent) {
  if (is_respondent === true) return "Respondido";
  if (is_respondent !== true) return "Calculado";
}

// ============================================================
// Helpers
// ============================================================
function isValidIdentifier(name) {
  return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name);
}

function flattenParams(obj) {
  const values = [];
  Object.values(obj).forEach((val) => {
    values.push(typeof val === 'object' && val !== null ? JSON.stringify(val) : val);
  });
  const placeholders = values.map((_, i) => `$${i + 1}`);
  return { values, placeholders };
}

// ============================================================
// Rotas de banco de dados
// ============================================================


// POST /api/execute-procedure-query
router.post('/execute-procedure-query', async (req, res) => {
  const { procedure, ...params } = req.query;
  if (!procedure) return formatValidationError(res, 'Parâmetro "procedure" é obrigatório na QueryString.', null);
  if (!isValidIdentifier(procedure)) return formatValidationError(res, 'Nome de procedure inválido.', procedure);
  const qualifiedName = routineRegistry.resolve('procedure', procedure);
  const values = Object.values(params);
  const placeholders = values.map((_, i) => `$${i + 1}`);
  const sql = `CALL ${qualifiedName}(${placeholders.join(', ')})`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    return formatResponse(res, { sucesso: true, mensagem: 'Procedure executada com sucesso', procedure, resultado: result.rows || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure, dados: null });
  }
});

// POST /api/execute-query
router.post('/execute-query', async (req, res) => {
  const { query: sql, params } = req.body;
  if (!sql || typeof sql !== 'string') return formatValidationError(res, 'Campo "query" é obrigatório e deve ser uma string.', 'query');
  const start = Date.now();
  try {
    const result = await pool.query(sql, params || []);
    return formatResponse(res, { sucesso: true, mensagem: 'Query executada com sucesso', procedure: 'query', resultado: result.rows || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: 'query', dados: null });
  }
});

// POST /api/execute-procedure-body
router.post('/execute-procedure-body', async (req, res) => {
  const { procedure, parametros } = req.body;
  if (!procedure || typeof procedure !== 'string') return formatValidationError(res, 'Campo "procedure" é obrigatório e deve ser uma string.', null);
  if (!isValidIdentifier(procedure)) return formatValidationError(res, 'Nome de procedure inválido.', procedure);
  const qualifiedName = routineRegistry.resolve('procedure', procedure);
  let values = [], placeholders = [];
  if (parametros && typeof parametros === 'object') {
    const flat = flattenParams(parametros);
    values = flat.values;
    placeholders = flat.placeholders;
  }
  const sql = `CALL ${qualifiedName}(${placeholders.join(', ')})`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    return formatResponse(res, { sucesso: true, mensagem: 'Procedure executada com sucesso', procedure, resultado: result.rows || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure, dados: null });
  }
});


router.get('/cliente', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_cliente');
  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    //aqui vai a magia da query
    let resp = []
    if(result.rows.length > 0){
      for (let index = 0; index < result.rows.length; index++) {
        let base = {
          id: 0,
          nome: 0,
          cpf: 0,
          telefone: 0,
          nps_score: 0,
          categoria: "",
          tipo: "",
          regiao: "",
          produtos: [],
          data_cadastro: "",
          endereco: "",
        }
        let element = result.rows[index];
        base.id = parseInt(element.customer_id,36);
        base.nome = element.customer_id; //TODO: Colocar o nome do cliente
        base.cpf = "000.000.000-00"; //TODO: Colocar o cpf do cliente
        base.telefone = "(00) 00000-0000";
        base.nps_score = element.nps_score;
        base.categoria = deriveCategoria(element.nps_score);
        base.tipo = deriveTipo(element.is_respondent);
        base.regiao = element.city + " - " + element.state;
        base.produtos[0] = element.plan_id;
        base.data_cadastro = element.account_open_date;
        base.endereco = 'R. Fidêncio Ramos, 101 - São Paulo - SP';
        resp.push(base);
      }
    }

    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

router.get('/produto', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_produto');
  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    //aqui vai a magia da query
    let resp = []
    if(result.rows.length > 0){
      for (let index = 0; index < result.rows.length; index++) {
        let base = {
          id: 0,
          nome: "",
          categoria: "",
        }
        let element = result.rows[index];
        base.id = element.plan_id;
        base.nome = element.plan_name;
        base.categoria = element.plan_type;
        resp.push(base);
      }
    }
    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

router.get('/metricasglobais', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_metricasglobais');
  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    //aqui vai a magia da query
    let resp = []
    if(result.rows.length > 0){
      for (let index = 0; index < result.rows.length; index++) {
        let base = {
            total_clientes: 0,
            total_respondidos: 0,
            total_calculados: 0,
            nps_score: 0,
            promotores: { quantidade: 0, percentual: 0 },
            neutros: { quantidade: 0, percentual: 0},
            detratores: { quantidade: 0, percentual: 0 },
        }

        let element = result.rows[index];
        let elementNum = Object.fromEntries(
          Object.entries(element).map(([key, value]) => {
            const num = parseFloat(value);
            return [key, isNaN(num) ? value : num];
          })
        );
        base.total_clientes = elementNum.total_clientes;
        base.total_respondidos = elementNum.total_respondidos;
        base.total_calculados = elementNum.total_calculados;
        base.nps_score = elementNum.nps_score;
        base.promotores.quantidade = elementNum.promotores_quantidade;
        base.promotores.percentual = elementNum.promotores_percentual;
        base.neutros.quantidade = elementNum.neutros_quantidade;  
        base.neutros.percentual = elementNum.neutros_percentual;
        base.detratores.quantidade = elementNum.detratores_quantidade;
        base.detratores.percentual = elementNum.detratores_percentual;         
        resp.push(base);
      }
    }
    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

router.get('/comparativonpstrue', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_comparativonps_true');
  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    //aqui vai a magia da query
    let resp = []
    if(result.rows.length > 0){
      for (let index = 0; index < result.rows.length; index++) {

        let element = result.rows[index];
    
        resp.push(element);
      }
    }
    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

module.exports = router;

