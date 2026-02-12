const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const routineRegistry = require('../config/routineRegistry');

// ============================================================
// Middleware de resposta padronizada
// ============================================================
function formatResponse(res, { sucesso, mensagem, procedure, resultado, registrosAfetados, tempoMs, aviso }) {
  const status = sucesso ? 200 : 500;
  const body = {
    sucesso,
    mensagem,
    procedure,
    dados: sucesso ? { resultado, registrosAfetados, tempoMs } : null,
  };
  if (aviso) body.aviso = aviso;
  return res.status(status).json(body);
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

function ajustahistoricoNps(historicoNps) {
  let arrayAux = [];
  for (let index = 0; index < historicoNps.length; index++) {
    const element = historicoNps[index];
    let base = { mes: "", csat: 0, nps: 0 }
    base.mes = element.mes;
    base.csat = 0;
    base.nps = element.nps;
    arrayAux.push(base);
  }
  return arrayAux;
}

function timeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds;
}


function ajustahistoricoTempoResposta(historicoNps,tempoMedioResposta) {
  let arrayAux = [];
  for (let index = 0; index < historicoNps.length; index++) {
    const element = historicoNps[index];
    let base = { mes: "", tempo: 0 }
    base.mes = element.mes;
    base.tempo = timeToSeconds(tempoMedioResposta)+(index*60);
    arrayAux.push(base);
  }
  return arrayAux;
}

function ajustahistoricoSatisfacaoBreakdown(driversBreakdown) {
  let arrayAux = [];
  let driversBreakdownAux = Object.entries(driversBreakdown);
  for (let index = 0; index < driversBreakdownAux.length; index++) {
    const element = driversBreakdownAux[index];
    let base = { categoria: "", muitoSatisfeito: 0, satisfeito: 0, neutro: 0, insatisfeito: 0, muitoInsatisfeito: 0 }
    if(element){
      base.categoria = element[0];
      if(typeof element[1] !== 'object'){
        continue;
      }
      if(element[1].hasOwnProperty('Muito satisfeito')){
        base.muitoSatisfeito = element[1]['Muito satisfeito'];
      }
      if(element[1].hasOwnProperty('Satisfeito')){
        base.satisfeito = element[1]['Satisfeito'];
      }
      if(element[1].hasOwnProperty('Neutro')){
        base.neutro = element[1]['Neutro'];
      }
      if(element[1].hasOwnProperty('Insatisfeito')){
        base.insatisfeito = element[1]['Insatisfeito'];
      }
      if(element[1].hasOwnProperty('Muito insatisfeito')){
        base.muitoInsatisfeito = element[1]['Muito insatisfeito'];
      }
    }
    arrayAux.push(base);
  }
  return arrayAux;
}


function ajustahistoricoComparativo(nps_score, historicoNps, arrayaux1, arrayaux2) {
  // Helper: converte para número seguro — null, undefined, NaN viram 0
  const avisos = [];
  function safeNum(value, campo) {
    const num = Number(value);
    if (value === null || value === undefined || isNaN(num)) {
      avisos.push(campo);
      return 0;
    }
    return num;
  }

  let detratoresRespondidoPorcentagem = 0;
  let neutrosRespondidoPorcentagem = 0;
  let promotoresRespondidoPorcentagem = 0;
  let detratoresCalculadoPorcentagem = 0;
  let neutrosCalculadoPorcentagem = 0;
  let promotoresCalculadoPorcentagem = 0;
  let detratoresRespondidoQuantidade = 0;
  let neutrosRespondidoQuantidade = 0;
  let promotoresRespondidoQuantidade = 0;
  let detratoresCalculadoQuantidade = 0;
  let neutrosCalculadoQuantidade = 0;
  let promotoresCalculadoQuantidade = 0;
  let totalRespondido = 0;
  let totalCalculado = 0;

  for (let index = 0; index < arrayaux1.length; index++) {
    let element = arrayaux1[index];
    totalRespondido = totalRespondido + safeNum(element.quantidade, `arrayaux1[${index}].quantidade`);
    if(element.nps_category === 'detrator'){
      detratoresRespondidoPorcentagem = safeNum(element.porcentagem, `respondido.detratores.porcentagem`);
      detratoresRespondidoQuantidade = safeNum(element.quantidade, `respondido.detratores.quantidade`);
    }
    if(element.nps_category === 'neutro'){
      neutrosRespondidoPorcentagem = safeNum(element.porcentagem, `respondido.neutros.porcentagem`);
      neutrosRespondidoQuantidade = safeNum(element.quantidade, `respondido.neutros.quantidade`);
    }
    if(element.nps_category === 'promotor'){
      promotoresRespondidoPorcentagem = safeNum(element.porcentagem, `respondido.promotores.porcentagem`);
      promotoresRespondidoQuantidade = safeNum(element.quantidade, `respondido.promotores.quantidade`);
    }
  }
  for (let index = 0; index < arrayaux2.length; index++) {
    let element = arrayaux2[index];
    totalCalculado = totalCalculado + safeNum(element.quantidade, `arrayaux2[${index}].quantidade`);
    if(element.nps_category === 'detrator'){
      detratoresCalculadoPorcentagem = safeNum(element.porcentagem, `calculado.detratores.porcentagem`);
      detratoresCalculadoQuantidade = safeNum(element.quantidade, `calculado.detratores.quantidade`);
    }
    if(element.nps_category === 'neutro'){
      neutrosCalculadoPorcentagem = safeNum(element.porcentagem, `calculado.neutros.porcentagem`);
      neutrosCalculadoQuantidade = safeNum(element.quantidade, `calculado.neutros.quantidade`);
    }
    if(element.nps_category === 'promotor'){
      promotoresCalculadoPorcentagem = safeNum(element.porcentagem, `calculado.promotores.porcentagem`);
      promotoresCalculadoQuantidade = safeNum(element.quantidade, `calculado.promotores.quantidade`);
    }
  }

  const safeNpsScore = safeNum(nps_score, 'nps_score');

  let retorno = {
    nps_respondido: {
      score: safeNpsScore,
      total_clientes: totalRespondido,
      promotores: { percentual: promotoresRespondidoPorcentagem, quantidade: promotoresRespondidoQuantidade },
      neutros: { percentual: neutrosRespondidoPorcentagem, quantidade: neutrosRespondidoQuantidade },
      detratores: { percentual: detratoresRespondidoPorcentagem, quantidade: detratoresRespondidoQuantidade },
    },
    nps_calculado: {
      score: safeNpsScore,
      total_clientes: totalCalculado,
      promotores: { percentual: promotoresCalculadoPorcentagem, quantidade: promotoresCalculadoQuantidade },
      neutros: { percentual: neutrosCalculadoPorcentagem, quantidade: neutrosCalculadoQuantidade },
      detratores: { percentual: detratoresCalculadoPorcentagem, quantidade: detratoresCalculadoQuantidade },
    },
    evolucao_nps: []
  }

  const soma = totalRespondido + totalCalculado;
  let percentual = soma > 0 ? totalRespondido / soma : 0;
  for (let index = 0; index < historicoNps.length; index++) {
    const element = historicoNps[index];
    const npsVal = safeNum(element.nps, `historicoNps[${index}].nps`);
    let base = { mes: "", respondido: 0, calculado: 0 }
    base.mes = element.mes || "";
    base.respondido = (safeNpsScore + npsVal) * percentual;
    base.calculado = (safeNpsScore + npsVal) * (1 - percentual);
    retorno.evolucao_nps.push(base);
  }

  // Deduplica avisos e monta string resumo
  const uniqueAvisos = [...new Set(avisos)];
  retorno._avisos = uniqueAvisos;

  return retorno;
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
          support_count: "",
          support_handle_time_avg: "",
          network_latency_avg: "",
          marketing_open_rate: "",
          plan_name: "",
          count_interactions: "",
          favorite_channel: "",
          digital_engagement: "",
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
        base.produtos[0] = element.plan_name;
        base.data_cadastro = element.account_open_date;
        base.endereco = 'R. Fidêncio Ramos, 101 - São Paulo - SP';
        base.support_count = element.support_count;
        base.support_handle_time_avg  = element.support_handle_time_avg;
        base.network_latency_avg = element.network_latency_avg;
        base.marketing_open_rate = element.marketing_open_rate;
        base.plan_name = element.plan_name;
        base.count_interactions = element.count_interactions;
        base.favorite_channel = element.favorite_channel;
        base.digital_engagement = element.digital_engagement;   

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

router.get('/comparativonpsfalse', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_comparativonps_false');
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


router.get('/metricasporproduto', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_metricas_por_produto');
  const funcNameaux1 = routineRegistry.resolve('function', 'fc_comparativonps_true');
  const funcNameaux2 = routineRegistry.resolve('function', 'fc_comparativonps_false');

  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const sqlaux1 = `SELECT * FROM ${funcNameaux1}()`;
  const sqlaux2 = `SELECT * FROM ${funcNameaux2}()`;
  const start = Date.now();
  try {
    const resultaux1 = await pool.query(sqlaux1, values);
    const arrayaux1 = [];
    if(resultaux1.rows.length > 0){
      for (let index = 0; index < resultaux1.rows.length; index++) {
        let element = resultaux1.rows[index];
        arrayaux1.push(element);
      }
    }
    const resultaux2 = await pool.query(sqlaux2, values);
    const arrayaux2 = [];
    if(resultaux2.rows.length > 0){
      for (let index = 0; index < resultaux2.rows.length; index++) {
        let element = resultaux2.rows[index];
        arrayaux2.push(element);
      }
    }
    const result = await pool.query(sql, values);

    let arrayAux = [];
    let todosAvisos = [];
    let resp = []
    if(result.rows.length > 0){
      for (let index = 0; index < result.rows.length; index++) {
        let base = {
          nps_score: 0,
          csat_score: 0,
          csat_mes_anterior: 0,
          ces_score: 0,
          tempo_medio_resposta: "",
          tempo_mes_anterior: "",
          total_clientes: 0,
          promotores: { percentual: 0, quantidade: 0 },
          neutros: { percentual: 0, quantidade: 0 },
          detratores: { percentual: 0, quantidade: 0 },
          evolucao_mensal: [],
          tempo_resposta_mensal: null,
          satisfacao_breakdown: null,
          comparativo: null,
        }
        let element = result.rows[index];
        base.nps_score = element.resultado.nps_score;
        base.tempo_medio_resposta = element.resultado.tempo_medio_resposta;
        base.total_clientes = element.resultado.total_clientes;
        base.promotores.percentual = element.resultado.promotores.percentual;
        base.promotores.quantidade = element.resultado.promotores.quantidade;
        base.neutros.percentual = element.resultado.neutros.percentual;
        base.neutros.quantidade = element.resultado.neutros.quantidade;
        base.detratores.percentual = element.resultado.detratores.percentual;
        base.detratores.quantidade = element.resultado.detratores.quantidade;
        base.evolucao_mensal = ajustahistoricoNps(element.resultado.historico_nps);
        base.tempo_resposta_mensal = ajustahistoricoTempoResposta(element.resultado.historico_nps,element.resultado.tempo_medio_resposta);
        base.satisfacao_breakdown = ajustahistoricoSatisfacaoBreakdown(element.resultado.drivers_breakdown);
        const comparativoResult = ajustahistoricoComparativo(element.resultado.nps_score, element.resultado.historico_nps, arrayaux1, arrayaux2);
        // Extrai avisos e remove do objeto de dados
        const { _avisos, ...comparativoData } = comparativoResult;
        if (_avisos && _avisos.length > 0) {
          todosAvisos.push(..._avisos.map(a => `[${element.plan_id}] ${a}`));
        }
        base.comparativo = comparativoData;
        arrayAux.push([element.plan_id,base]);
      }
      let objAux = Object.fromEntries(arrayAux);
      resp.push(objAux);
    }
    const aviso = todosAvisos.length > 0
      ? `${todosAvisos.length} valor(es) nulo(s) ou inválido(s) foram substituídos por 0: ${[...new Set(todosAvisos)].join(', ')}`
      : undefined;
    console.log('[DEBUG metricasporproduto] todosAvisos:', todosAvisos.length, '| aviso:', aviso ? aviso.substring(0, 100) : 'nenhum');
    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp[0] || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start, aviso });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

router.get('/localizacao', async (req, res) => {
  const funcName = routineRegistry.resolve('function', 'fc_localizacao');
  if (!isValidIdentifier(funcName)) return formatValidationError(res, 'Nome de função inválido.', funcName);
  let values = [];
  const sql = `SELECT * FROM ${funcName}()`;
  const start = Date.now();
  try {
    const result = await pool.query(sql, values);
    let resp = [];
    if (result.rows.length > 0) {
      for (let index = 0; index < result.rows.length; index++) {
        let element = result.rows[index];
        let base = {
          regiao: element.region,
          estado: element.state,
          cidade: element.city,
          quantidade: Number(element.quantidade)
        };
        resp.push(base);
      }
    }
    return formatResponse(res, { sucesso: true, mensagem: 'Função executada com sucesso', procedure: funcName, resultado: resp || [], registrosAfetados: result.rowCount ?? 0, tempoMs: Date.now() - start });
  } catch (err) {
    return res.status(500).json({ sucesso: false, mensagem: `Erro ao executar: ${err.message}`, procedure: funcName, dados: null });
  }
});

module.exports = router;

