const express = require('express');
const router = express.Router();

// ============================================================
// DADOS MOCK — convertidos de mockData.ts e produtosData.ts
// ============================================================

// --- clientes (mockData.ts → Cliente[]) ---
const clientes = [
  { id: 1, nome: "Maria Silva", cpf: "123.456.789-00", telefone: "(11) 98765-4321", nps_score: 9, categoria: "Promotor", tipo: "Respondido", regiao: "São Paulo - SP", produtos: ["Claro Móvel 50GB", "Internet 500MB"], data_cadastro: "2020-03-15", endereco: "Rua Augusta, 1200 - São Paulo, SP" },
  { id: 2, nome: "João Santos", cpf: "987.654.321-00", telefone: "(21) 97654-3210", nps_score: 4, categoria: "Detrator", tipo: "Calculado", regiao: "Rio de Janeiro - RJ", produtos: ["Claro Móvel 20GB"], data_cadastro: "2019-07-22", endereco: "Av. Atlântica, 500 - Rio de Janeiro, RJ" },
  { id: 3, nome: "Ana Costa", cpf: "456.789.123-00", telefone: "(11) 96543-2109", nps_score: 10, categoria: "Promotor", tipo: "Respondido", regiao: "São Paulo - SP", produtos: ["Claro Móvel 100GB", "Claro TV", "Internet 1GB"], data_cadastro: "2021-01-10", endereco: "Rua Oscar Freire, 88 - São Paulo, SP" },
  { id: 4, nome: "Pedro Oliveira", cpf: "321.654.987-00", telefone: "(61) 95432-1098", nps_score: 7, categoria: "Neutro", tipo: "Calculado", regiao: "Brasília - DF", produtos: ["Claro Fixo", "Internet 300MB"], data_cadastro: "2018-11-05", endereco: "SQS 308, Bloco A - Brasília, DF" },
  { id: 5, nome: "Carla Mendes", cpf: "654.321.987-00", telefone: "(31) 94321-0987", nps_score: 9, categoria: "Promotor", tipo: "Respondido", regiao: "Belo Horizonte - MG", produtos: ["Claro Móvel 80GB", "Internet 600MB"], data_cadastro: "2020-06-18", endereco: "Rua da Bahia, 1150 - Belo Horizonte, MG" },
  { id: 6, nome: "Lucas Ferreira", cpf: "789.123.456-00", telefone: "(51) 93210-9876", nps_score: 3, categoria: "Detrator", tipo: "Calculado", regiao: "Porto Alegre - RS", produtos: ["Claro Móvel 10GB"], data_cadastro: "2022-02-28", endereco: "Av. Ipiranga, 1200 - Porto Alegre, RS" },
  { id: 7, nome: "Juliana Almeida", cpf: "147.258.369-00", telefone: "(41) 92109-8765", nps_score: 10, categoria: "Promotor", tipo: "Calculado", regiao: "Curitiba - PR", produtos: ["Claro Móvel 50GB", "Claro TV", "Internet 1GB", "Claro Fixo"], data_cadastro: "2019-09-12", endereco: "Rua XV de Novembro, 500 - Curitiba, PR" },
  { id: 8, nome: "Rafael Lima", cpf: "258.369.147-00", telefone: "(71) 91098-7654", nps_score: 8, categoria: "Neutro", tipo: "Respondido", regiao: "Salvador - BA", produtos: ["Claro Móvel 30GB", "Internet 200MB"], data_cadastro: "2021-04-20", endereco: "Rua Chile, 200 - Salvador, BA" },
  { id: 9, nome: "Fernanda Rocha", cpf: "369.147.258-00", telefone: "(85) 90987-6543", nps_score: 9, categoria: "Promotor", tipo: "Respondido", regiao: "Fortaleza - CE", produtos: ["Claro Móvel 80GB", "Internet 500MB"], data_cadastro: "2020-08-30", endereco: "Av. Beira Mar, 3000 - Fortaleza, CE" },
  { id: 10, nome: "Bruno Cardoso", cpf: "741.852.963-00", telefone: "(81) 89876-5432", nps_score: 5, categoria: "Detrator", tipo: "Calculado", regiao: "Recife - PE", produtos: ["Claro Móvel 15GB"], data_cadastro: "2022-01-14", endereco: "Rua da Aurora, 800 - Recife, PE" },
  { id: 11, nome: "Patrícia Souza", cpf: "852.963.741-00", telefone: "(11) 88765-4321", nps_score: 7, categoria: "Neutro", tipo: "Calculado", regiao: "São Paulo - SP", produtos: ["Claro Móvel 30GB"], data_cadastro: "2021-07-08", endereco: "Av. Paulista, 1500 - São Paulo, SP" },
  { id: 12, nome: "Diego Martins", cpf: "963.741.852-00", telefone: "(21) 87654-3210", nps_score: 10, categoria: "Promotor", tipo: "Respondido", regiao: "Rio de Janeiro - RJ", produtos: ["Claro Móvel 100GB", "Claro TV", "Internet 1GB"], data_cadastro: "2019-12-01", endereco: "Rua Visconde de Pirajá, 400 - Rio de Janeiro, RJ" },
  { id: 13, nome: "Camila Ribeiro", cpf: "159.357.486-00", telefone: "(92) 86543-2109", nps_score: 2, categoria: "Detrator", tipo: "Respondido", regiao: "Manaus - AM", produtos: ["Claro Móvel 5GB"], data_cadastro: "2023-03-22", endereco: "Av. Eduardo Ribeiro, 600 - Manaus, AM" },
  { id: 14, nome: "Thiago Barbosa", cpf: "357.486.159-00", telefone: "(61) 85432-1098", nps_score: 9, categoria: "Promotor", tipo: "Calculado", regiao: "Brasília - DF", produtos: ["Claro Móvel 80GB", "Internet 500MB", "Claro Fixo"], data_cadastro: "2020-05-15", endereco: "SQN 204, Bloco C - Brasília, DF" },
  { id: 15, nome: "Amanda Torres", cpf: "486.159.357-00", telefone: "(31) 84321-0987", nps_score: 8, categoria: "Neutro", tipo: "Respondido", regiao: "Belo Horizonte - MG", produtos: ["Claro Móvel 50GB", "Internet 300MB"], data_cadastro: "2021-10-05", endereco: "Praça da Liberdade, 100 - Belo Horizonte, MG" },
  { id: 16, nome: "Roberto Nascimento", cpf: "624.813.579-00", telefone: "(71) 83210-9876", nps_score: 10, categoria: "Promotor", tipo: "Calculado", regiao: "Salvador - BA", produtos: ["Claro Móvel 100GB", "Claro TV"], data_cadastro: "2018-08-20", endereco: "Av. Tancredo Neves, 900 - Salvador, BA" },
  { id: 17, nome: "Isabela Gomes", cpf: "813.579.624-00", telefone: "(11) 82109-8765", nps_score: 6, categoria: "Detrator", tipo: "Calculado", regiao: "São Paulo - SP", produtos: ["Internet 200MB"], data_cadastro: "2022-06-10", endereco: "Rua da Consolação, 2200 - São Paulo, SP" },
  { id: 18, nome: "Marcelo Pereira", cpf: "579.624.813-00", telefone: "(41) 81098-7654", nps_score: 9, categoria: "Promotor", tipo: "Respondido", regiao: "Curitiba - PR", produtos: ["Claro Móvel 50GB", "Claro TV", "Internet 600MB"], data_cadastro: "2020-11-25", endereco: "Rua Comendador Araújo, 300 - Curitiba, PR" },
  { id: 19, nome: "Larissa Castro", cpf: "246.135.789-00", telefone: "(85) 80987-6543", nps_score: 7, categoria: "Neutro", tipo: "Calculado", regiao: "Fortaleza - CE", produtos: ["Claro Móvel 20GB", "Internet 100MB"], data_cadastro: "2021-09-18", endereco: "Rua Barão de Studart, 1500 - Fortaleza, CE" },
  { id: 20, nome: "Felipe Duarte", cpf: "135.789.246-00", telefone: "(51) 79876-5432", nps_score: 10, categoria: "Promotor", tipo: "Respondido", regiao: "Porto Alegre - RS", produtos: ["Claro Móvel 80GB", "Internet 1GB", "Claro TV", "Claro Fixo"], data_cadastro: "2019-04-08", endereco: "Rua dos Andradas, 1000 - Porto Alegre, RS" },
];

// --- regioes (mockData.ts → RegionalData[]) ---
const regioes = [
  { cidade: "São Paulo", estado: "SP", lat: -23.5505, lng: -46.6333, nps_score: 58, total_clientes: 25000, categoria_cor: "verde" },
  { cidade: "Rio de Janeiro", estado: "RJ", lat: -22.9068, lng: -43.1729, nps_score: 45, total_clientes: 18000, categoria_cor: "amarelo" },
  { cidade: "Brasília", estado: "DF", lat: -15.8267, lng: -47.9218, nps_score: 62, total_clientes: 8000, categoria_cor: "verde" },
  { cidade: "Belo Horizonte", estado: "MG", lat: -19.9167, lng: -43.9345, nps_score: 52, total_clientes: 9000, categoria_cor: "verde" },
  { cidade: "Salvador", estado: "BA", lat: -12.9714, lng: -38.5124, nps_score: 38, total_clientes: 7000, categoria_cor: "amarelo" },
  { cidade: "Fortaleza", estado: "CE", lat: -3.7172, lng: -38.5247, nps_score: 55, total_clientes: 6000, categoria_cor: "verde" },
  { cidade: "Recife", estado: "PE", lat: -8.0476, lng: -34.877, nps_score: 30, total_clientes: 5000, categoria_cor: "vermelho" },
  { cidade: "Porto Alegre", estado: "RS", lat: -30.0346, lng: -51.2177, nps_score: 60, total_clientes: 5500, categoria_cor: "verde" },
  { cidade: "Curitiba", estado: "PR", lat: -25.4284, lng: -49.2733, nps_score: 65, total_clientes: 4000, categoria_cor: "verde" },
  { cidade: "Manaus", estado: "AM", lat: -3.119, lng: -60.0217, nps_score: 42, total_clientes: 2500, categoria_cor: "amarelo" },
];

// --- metricasGlobais (mockData.ts → MetricasGlobais) ---
const metricasGlobais = {
  total_clientes: 90000,
  total_respondidos: 5000,
  total_calculados: 85000,
  nps_score: 55.95,
  promotores: { quantidade: 61000, percentual: 67.76 },
  neutros: { quantidade: 18387, percentual: 20.43 },
  detratores: { quantidade: 10629, percentual: 11.81 },
};

// --- evolucaoData (mockData.ts → EvolucaoData) ---
const evolucaoData = {
  meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  nps_respondido: [52, 53, 54, 55, 56, 57],
  nps_calculado: [51, 52, 53, 54, 55, 56],
};

// --- produtos (produtosData.ts → Produto[]) ---
const produtos = [
  { id: 1, nome: "Claro Móvel 5GB", categoria: "Plano Móvel" },
  { id: 2, nome: "Claro Móvel 20GB", categoria: "Plano Móvel" },
  { id: 3, nome: "Claro Móvel 50GB", categoria: "Plano Móvel" },
  { id: 4, nome: "Claro Móvel 100GB", categoria: "Plano Móvel" },
  { id: 5, nome: "Internet 200MB", categoria: "Banda Larga" },
  { id: 6, nome: "Internet 500MB", categoria: "Banda Larga" },
  { id: 7, nome: "Internet 1GB", categoria: "Banda Larga" },
  { id: 8, nome: "Claro TV", categoria: "TV por Assinatura" },
  { id: 9, nome: "Claro Fixo", categoria: "Telefonia Fixa" },
  { id: 10, nome: "Claro Combo", categoria: "Combo" },
];

// --- Helpers para gerar métricas de produto (produtosData.ts) ---
function generateBreakdown() {
  return [
    { categoria: "Atendimento", muitoSatisfeito: 30, satisfeito: 25, neutro: 20, insatisfeito: 15, muitoInsatisfeito: 10 },
    { categoria: "Cobertura", muitoSatisfeito: 35, satisfeito: 28, neutro: 18, insatisfeito: 12, muitoInsatisfeito: 7 },
    { categoria: "Preço", muitoSatisfeito: 20, satisfeito: 22, neutro: 25, insatisfeito: 20, muitoInsatisfeito: 13 },
    { categoria: "Qualidade", muitoSatisfeito: 32, satisfeito: 30, neutro: 18, insatisfeito: 12, muitoInsatisfeito: 8 },
  ];
}

function generateTempoMensal(base) {
  return [
    { mes: "Set", tempo: base + 4 },
    { mes: "Out", tempo: base + 3 },
    { mes: "Nov", tempo: base + 2 },
    { mes: "Dez", tempo: base + 1 },
    { mes: "Jan", tempo: base + 0.5 },
    { mes: "Fev", tempo: base },
  ];
}

function generateComparativo(npsScore, totalRespondido, totalCalculado, promPct, neuPct, detPct) {
  const promQtdR = Math.round(totalRespondido * promPct / 100);
  const neuQtdR = Math.round(totalRespondido * neuPct / 100);
  const detQtdR = totalRespondido - promQtdR - neuQtdR;
  const promQtdC = Math.round(totalCalculado * promPct / 100);
  const neuQtdC = Math.round(totalCalculado * neuPct / 100);
  const detQtdC = totalCalculado - promQtdC - neuQtdC;
  return {
    nps_respondido: {
      score: npsScore, total_clientes: totalRespondido,
      promotores: { percentual: promPct, quantidade: promQtdR },
      neutros: { percentual: neuPct, quantidade: neuQtdR },
      detratores: { percentual: detPct, quantidade: detQtdR },
    },
    nps_calculado: {
      score: npsScore, total_clientes: totalCalculado,
      promotores: { percentual: promPct, quantidade: promQtdC },
      neutros: { percentual: neuPct, quantidade: neuQtdC },
      detratores: { percentual: detPct, quantidade: detQtdC },
    },
    evolucao_nps: [
      { mes: "Jan", respondido: npsScore - 5, calculado: npsScore - 4 },
      { mes: "Fev", respondido: npsScore - 3, calculado: npsScore - 3 },
      { mes: "Mar", respondido: npsScore - 2, calculado: npsScore - 1 },
      { mes: "Abr", respondido: npsScore - 1, calculado: npsScore },
      { mes: "Mai", respondido: npsScore + 1, calculado: npsScore + 1 },
      { mes: "Jun", respondido: npsScore + 2, calculado: npsScore + 2 },
    ],
  };
}

// --- metricasPorProduto (produtosData.ts → Record<number, ProdutoMetricas>) ---
const metricasPorProduto = {
  1: {
    nps_score: 32, csat_score: 58, csat_mes_anterior: 55, ces_score: 45.2,
    tempo_medio_resposta: "14:30", tempo_mes_anterior: "16:05", total_clientes: 4200,
    promotores: { percentual: 42.5, quantidade: 1785 },
    neutros: { percentual: 25.3, quantidade: 1063 },
    detratores: { percentual: 32.2, quantidade: 1352 },
    evolucao_mensal: [{ mes: "Set", csat: 52, nps: 28 },{ mes: "Out", csat: 54, nps: 29 },{ mes: "Nov", csat: 55, nps: 30 },{ mes: "Dez", csat: 56, nps: 31 },{ mes: "Jan", csat: 57, nps: 31 },{ mes: "Fev", csat: 58, nps: 32 }],
    tempo_resposta_mensal: generateTempoMensal(14.5),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(32, 5000, 85000, 42.5, 25.3, 32.2),
  },
  2: {
    nps_score: 45, csat_score: 65, csat_mes_anterior: 62, ces_score: 58.7,
    tempo_medio_resposta: "11:20", tempo_mes_anterior: "12:45", total_clientes: 8500,
    promotores: { percentual: 55.0, quantidade: 4675 },
    neutros: { percentual: 22.0, quantidade: 1870 },
    detratores: { percentual: 23.0, quantidade: 1955 },
    evolucao_mensal: [{ mes: "Set", csat: 60, nps: 40 },{ mes: "Out", csat: 61, nps: 41 },{ mes: "Nov", csat: 62, nps: 42 },{ mes: "Dez", csat: 63, nps: 43 },{ mes: "Jan", csat: 64, nps: 44 },{ mes: "Fev", csat: 65, nps: 45 }],
    tempo_resposta_mensal: generateTempoMensal(11.3),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(45, 6200, 72000, 55.0, 22.0, 23.0),
  },
  3: {
    nps_score: 62, csat_score: 73, csat_mes_anterior: 70, ces_score: 75.9,
    tempo_medio_resposta: "8:45", tempo_mes_anterior: "10:12", total_clientes: 15200,
    promotores: { percentual: 67.8, quantidade: 10306 },
    neutros: { percentual: 20.4, quantidade: 3101 },
    detratores: { percentual: 11.8, quantidade: 1794 },
    evolucao_mensal: [{ mes: "Set", csat: 68, nps: 57 },{ mes: "Out", csat: 69, nps: 58 },{ mes: "Nov", csat: 70, nps: 59 },{ mes: "Dez", csat: 71, nps: 60 },{ mes: "Jan", csat: 72, nps: 61 },{ mes: "Fev", csat: 73, nps: 62 }],
    tempo_resposta_mensal: generateTempoMensal(8.75),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(62, 8400, 95000, 67.8, 20.4, 11.8),
  },
  4: {
    nps_score: 71, csat_score: 80, csat_mes_anterior: 78, ces_score: 82.1,
    tempo_medio_resposta: "6:10", tempo_mes_anterior: "7:30", total_clientes: 12000,
    promotores: { percentual: 76.2, quantidade: 9144 },
    neutros: { percentual: 15.5, quantidade: 1860 },
    detratores: { percentual: 8.3, quantidade: 996 },
    evolucao_mensal: [{ mes: "Set", csat: 75, nps: 66 },{ mes: "Out", csat: 76, nps: 67 },{ mes: "Nov", csat: 77, nps: 68 },{ mes: "Dez", csat: 78, nps: 69 },{ mes: "Jan", csat: 79, nps: 70 },{ mes: "Fev", csat: 80, nps: 71 }],
    tempo_resposta_mensal: generateTempoMensal(6.2),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(71, 7500, 88000, 76.2, 15.5, 8.3),
  },
  5: {
    nps_score: 38, csat_score: 55, csat_mes_anterior: 52, ces_score: 42.3,
    tempo_medio_resposta: "18:00", tempo_mes_anterior: "20:15", total_clientes: 3800,
    promotores: { percentual: 45.0, quantidade: 1710 },
    neutros: { percentual: 24.0, quantidade: 912 },
    detratores: { percentual: 31.0, quantidade: 1178 },
    evolucao_mensal: [{ mes: "Set", csat: 50, nps: 33 },{ mes: "Out", csat: 51, nps: 34 },{ mes: "Nov", csat: 52, nps: 35 },{ mes: "Dez", csat: 53, nps: 36 },{ mes: "Jan", csat: 54, nps: 37 },{ mes: "Fev", csat: 55, nps: 38 }],
    tempo_resposta_mensal: generateTempoMensal(18),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(38, 3200, 62000, 45.0, 24.0, 31.0),
  },
  6: {
    nps_score: 55, csat_score: 68, csat_mes_anterior: 65, ces_score: 64.8,
    tempo_medio_resposta: "10:30", tempo_mes_anterior: "11:50", total_clientes: 9200,
    promotores: { percentual: 60.5, quantidade: 5566 },
    neutros: { percentual: 21.0, quantidade: 1932 },
    detratores: { percentual: 18.5, quantidade: 1702 },
    evolucao_mensal: [{ mes: "Set", csat: 63, nps: 50 },{ mes: "Out", csat: 64, nps: 51 },{ mes: "Nov", csat: 65, nps: 52 },{ mes: "Dez", csat: 66, nps: 53 },{ mes: "Jan", csat: 67, nps: 54 },{ mes: "Fev", csat: 68, nps: 55 }],
    tempo_resposta_mensal: generateTempoMensal(10.5),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(55, 5800, 78000, 60.5, 21.0, 18.5),
  },
  7: {
    nps_score: 68, csat_score: 78, csat_mes_anterior: 75, ces_score: 78.4,
    tempo_medio_resposta: "7:20", tempo_mes_anterior: "8:40", total_clientes: 11500,
    promotores: { percentual: 72.0, quantidade: 8280 },
    neutros: { percentual: 17.5, quantidade: 2013 },
    detratores: { percentual: 10.5, quantidade: 1208 },
    evolucao_mensal: [{ mes: "Set", csat: 73, nps: 63 },{ mes: "Out", csat: 74, nps: 64 },{ mes: "Nov", csat: 75, nps: 65 },{ mes: "Dez", csat: 76, nps: 66 },{ mes: "Jan", csat: 77, nps: 67 },{ mes: "Fev", csat: 78, nps: 68 }],
    tempo_resposta_mensal: generateTempoMensal(7.3),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(68, 7200, 92000, 72.0, 17.5, 10.5),
  },
  8: {
    nps_score: 50, csat_score: 64, csat_mes_anterior: 61, ces_score: 60.2,
    tempo_medio_resposta: "12:00", tempo_mes_anterior: "13:25", total_clientes: 7800,
    promotores: { percentual: 58.0, quantidade: 4524 },
    neutros: { percentual: 22.5, quantidade: 1755 },
    detratores: { percentual: 19.5, quantidade: 1521 },
    evolucao_mensal: [{ mes: "Set", csat: 59, nps: 45 },{ mes: "Out", csat: 60, nps: 46 },{ mes: "Nov", csat: 61, nps: 47 },{ mes: "Dez", csat: 62, nps: 48 },{ mes: "Jan", csat: 63, nps: 49 },{ mes: "Fev", csat: 64, nps: 50 }],
    tempo_resposta_mensal: generateTempoMensal(12),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(50, 4800, 68000, 58.0, 22.5, 19.5),
  },
  9: {
    nps_score: 42, csat_score: 60, csat_mes_anterior: 57, ces_score: 52.6,
    tempo_medio_resposta: "15:10", tempo_mes_anterior: "17:00", total_clientes: 5500,
    promotores: { percentual: 50.0, quantidade: 2750 },
    neutros: { percentual: 24.0, quantidade: 1320 },
    detratores: { percentual: 26.0, quantidade: 1430 },
    evolucao_mensal: [{ mes: "Set", csat: 55, nps: 37 },{ mes: "Out", csat: 56, nps: 38 },{ mes: "Nov", csat: 57, nps: 39 },{ mes: "Dez", csat: 58, nps: 40 },{ mes: "Jan", csat: 59, nps: 41 },{ mes: "Fev", csat: 60, nps: 42 }],
    tempo_resposta_mensal: generateTempoMensal(15.2),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(42, 4200, 71000, 50.0, 24.0, 26.0),
  },
  10: {
    nps_score: 74, csat_score: 82, csat_mes_anterior: 80, ces_score: 85.3,
    tempo_medio_resposta: "5:45", tempo_mes_anterior: "6:50", total_clientes: 6200,
    promotores: { percentual: 78.5, quantidade: 4867 },
    neutros: { percentual: 14.0, quantidade: 868 },
    detratores: { percentual: 7.5, quantidade: 465 },
    evolucao_mensal: [{ mes: "Set", csat: 77, nps: 69 },{ mes: "Out", csat: 78, nps: 70 },{ mes: "Nov", csat: 79, nps: 71 },{ mes: "Dez", csat: 80, nps: 72 },{ mes: "Jan", csat: 81, nps: 73 },{ mes: "Fev", csat: 82, nps: 74 }],
    tempo_resposta_mensal: generateTempoMensal(5.75),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(74, 4000, 55000, 78.5, 14.0, 7.5),
  },
};

// ============================================================
// Rotas de dados para o frontend
// ============================================================

// GET /api/clientes — retorna lista de clientes (Cliente[])
router.get('/clientes', (req, res) => {
  res.json(clientes);
});

// GET /api/regioes — retorna dados regionais (RegionalData[])
router.get('/regioes', (req, res) => {
  res.json(regioes);
});

// GET /api/metricas — retorna métricas globais (MetricasGlobais)
router.get('/metricas', (req, res) => {
  res.json(metricasGlobais);
});

// GET /api/evolucao — retorna evolução mensal (EvolucaoData)
router.get('/evolucao', (req, res) => {
  res.json(evolucaoData);
});

// GET /api/produtos — retorna lista de produtos (Produto[])
router.get('/produtos', (req, res) => {
  res.json(produtos);
});

// GET /api/produtos/:id/metricas — retorna métricas de um produto (ProdutoMetricas)
router.get('/produtos/:id/metricas', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const metricas = metricasPorProduto[id];

  if (!metricas) {
    return res.status(404).json({
      sucesso: false,
      mensagem: `Produto com id ${id} não encontrado.`,
    });
  }

  res.json(metricas);
});

module.exports = router;

