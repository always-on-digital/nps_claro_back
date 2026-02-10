export interface Produto {
  id: number;
  nome: string;
  categoria: string;
}

export interface NpsDistribuicao {
  percentual: number;
  quantidade: number;
}

export interface ComparativoNps {
  nps_respondido: {
    score: number;
    total_clientes: number;
    promotores: NpsDistribuicao;
    neutros: NpsDistribuicao;
    detratores: NpsDistribuicao;
  };
  nps_calculado: {
    score: number;
    total_clientes: number;
    promotores: NpsDistribuicao;
    neutros: NpsDistribuicao;
    detratores: NpsDistribuicao;
  };
  evolucao_nps: { mes: string; respondido: number; calculado: number }[];
}

export interface ProdutoMetricas {
  nps_score: number;
  csat_score: number;
  csat_mes_anterior: number;
  ces_score: number;
  tempo_medio_resposta: string;
  tempo_mes_anterior: string;
  total_clientes: number;
  promotores: { percentual: number; quantidade: number };
  neutros: { percentual: number; quantidade: number };
  detratores: { percentual: number; quantidade: number };
  evolucao_mensal: { mes: string; csat: number; nps: number }[];
  tempo_resposta_mensal: { mes: string; tempo: number }[];
  satisfacao_breakdown: {
    categoria: string;
    muitoSatisfeito: number;
    satisfeito: number;
    neutro: number;
    insatisfeito: number;
    muitoInsatisfeito: number;
  }[];
  comparativo: ComparativoNps;
}

export const produtos: Produto[] = [
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

function generateBreakdown(): ProdutoMetricas["satisfacao_breakdown"] {
  return [
    { categoria: "Atendimento", muitoSatisfeito: 30, satisfeito: 25, neutro: 20, insatisfeito: 15, muitoInsatisfeito: 10 },
    { categoria: "Cobertura", muitoSatisfeito: 35, satisfeito: 28, neutro: 18, insatisfeito: 12, muitoInsatisfeito: 7 },
    { categoria: "Preço", muitoSatisfeito: 20, satisfeito: 22, neutro: 25, insatisfeito: 20, muitoInsatisfeito: 13 },
    { categoria: "Qualidade", muitoSatisfeito: 32, satisfeito: 30, neutro: 18, insatisfeito: 12, muitoInsatisfeito: 8 },
  ];
}

function generateTempoMensal(base: number): ProdutoMetricas["tempo_resposta_mensal"] {
  return [
    { mes: "Set", tempo: base + 4 },
    { mes: "Out", tempo: base + 3 },
    { mes: "Nov", tempo: base + 2 },
    { mes: "Dez", tempo: base + 1 },
    { mes: "Jan", tempo: base + 0.5 },
    { mes: "Fev", tempo: base },
  ];
}

function generateComparativo(
  npsScore: number,
  totalRespondido: number,
  totalCalculado: number,
  promPct: number,
  neuPct: number,
  detPct: number,
): ComparativoNps {
  const promQtdR = Math.round(totalRespondido * promPct / 100);
  const neuQtdR = Math.round(totalRespondido * neuPct / 100);
  const detQtdR = totalRespondido - promQtdR - neuQtdR;
  const promQtdC = Math.round(totalCalculado * promPct / 100);
  const neuQtdC = Math.round(totalCalculado * neuPct / 100);
  const detQtdC = totalCalculado - promQtdC - neuQtdC;

  return {
    nps_respondido: {
      score: npsScore,
      total_clientes: totalRespondido,
      promotores: { percentual: promPct, quantidade: promQtdR },
      neutros: { percentual: neuPct, quantidade: neuQtdR },
      detratores: { percentual: detPct, quantidade: detQtdR },
    },
    nps_calculado: {
      score: npsScore,
      total_clientes: totalCalculado,
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

const metricasPorProduto: Record<number, ProdutoMetricas> = {
  1: {
    nps_score: 32,
    csat_score: 58,
    csat_mes_anterior: 55,
    ces_score: 45.2,
    tempo_medio_resposta: "14:30",
    tempo_mes_anterior: "16:05",
    total_clientes: 4200,
    promotores: { percentual: 42.5, quantidade: 1785 },
    neutros: { percentual: 25.3, quantidade: 1063 },
    detratores: { percentual: 32.2, quantidade: 1352 },
    evolucao_mensal: [
      { mes: "Set", csat: 52, nps: 28 },
      { mes: "Out", csat: 54, nps: 29 },
      { mes: "Nov", csat: 55, nps: 30 },
      { mes: "Dez", csat: 56, nps: 31 },
      { mes: "Jan", csat: 57, nps: 31 },
      { mes: "Fev", csat: 58, nps: 32 },
    ],
    tempo_resposta_mensal: generateTempoMensal(14.5),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(32, 5000, 85000, 42.5, 25.3, 32.2),
  },
  2: {
    nps_score: 45,
    csat_score: 65,
    csat_mes_anterior: 62,
    ces_score: 58.7,
    tempo_medio_resposta: "11:20",
    tempo_mes_anterior: "12:45",
    total_clientes: 8500,
    promotores: { percentual: 55.0, quantidade: 4675 },
    neutros: { percentual: 22.0, quantidade: 1870 },
    detratores: { percentual: 23.0, quantidade: 1955 },
    evolucao_mensal: [
      { mes: "Set", csat: 60, nps: 40 },
      { mes: "Out", csat: 61, nps: 41 },
      { mes: "Nov", csat: 62, nps: 42 },
      { mes: "Dez", csat: 63, nps: 43 },
      { mes: "Jan", csat: 64, nps: 44 },
      { mes: "Fev", csat: 65, nps: 45 },
    ],
    tempo_resposta_mensal: generateTempoMensal(11.3),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(45, 6200, 72000, 55.0, 22.0, 23.0),
  },
  3: {
    nps_score: 62,
    csat_score: 73,
    csat_mes_anterior: 70,
    ces_score: 75.9,
    tempo_medio_resposta: "8:45",
    tempo_mes_anterior: "10:12",
    total_clientes: 15200,
    promotores: { percentual: 67.8, quantidade: 10306 },
    neutros: { percentual: 20.4, quantidade: 3101 },
    detratores: { percentual: 11.8, quantidade: 1794 },
    evolucao_mensal: [
      { mes: "Set", csat: 68, nps: 57 },
      { mes: "Out", csat: 69, nps: 58 },
      { mes: "Nov", csat: 70, nps: 59 },
      { mes: "Dez", csat: 71, nps: 60 },
      { mes: "Jan", csat: 72, nps: 61 },
      { mes: "Fev", csat: 73, nps: 62 },
    ],
    tempo_resposta_mensal: generateTempoMensal(8.75),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(62, 8400, 95000, 67.8, 20.4, 11.8),
  },
  4: {
    nps_score: 71,
    csat_score: 80,
    csat_mes_anterior: 78,
    ces_score: 82.1,
    tempo_medio_resposta: "6:10",
    tempo_mes_anterior: "7:30",
    total_clientes: 12000,
    promotores: { percentual: 76.2, quantidade: 9144 },
    neutros: { percentual: 15.5, quantidade: 1860 },
    detratores: { percentual: 8.3, quantidade: 996 },
    evolucao_mensal: [
      { mes: "Set", csat: 75, nps: 66 },
      { mes: "Out", csat: 76, nps: 67 },
      { mes: "Nov", csat: 77, nps: 68 },
      { mes: "Dez", csat: 78, nps: 69 },
      { mes: "Jan", csat: 79, nps: 70 },
      { mes: "Fev", csat: 80, nps: 71 },
    ],
    tempo_resposta_mensal: generateTempoMensal(6.2),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(71, 7500, 88000, 76.2, 15.5, 8.3),
  },
  5: {
    nps_score: 38,
    csat_score: 55,
    csat_mes_anterior: 52,
    ces_score: 42.3,
    tempo_medio_resposta: "18:00",
    tempo_mes_anterior: "20:15",
    total_clientes: 3800,
    promotores: { percentual: 45.0, quantidade: 1710 },
    neutros: { percentual: 24.0, quantidade: 912 },
    detratores: { percentual: 31.0, quantidade: 1178 },
    evolucao_mensal: [
      { mes: "Set", csat: 50, nps: 33 },
      { mes: "Out", csat: 51, nps: 34 },
      { mes: "Nov", csat: 52, nps: 35 },
      { mes: "Dez", csat: 53, nps: 36 },
      { mes: "Jan", csat: 54, nps: 37 },
      { mes: "Fev", csat: 55, nps: 38 },
    ],
    tempo_resposta_mensal: generateTempoMensal(18),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(38, 3200, 62000, 45.0, 24.0, 31.0),
  },
  6: {
    nps_score: 55,
    csat_score: 68,
    csat_mes_anterior: 65,
    ces_score: 64.8,
    tempo_medio_resposta: "10:30",
    tempo_mes_anterior: "11:50",
    total_clientes: 9200,
    promotores: { percentual: 60.5, quantidade: 5566 },
    neutros: { percentual: 21.0, quantidade: 1932 },
    detratores: { percentual: 18.5, quantidade: 1702 },
    evolucao_mensal: [
      { mes: "Set", csat: 63, nps: 50 },
      { mes: "Out", csat: 64, nps: 51 },
      { mes: "Nov", csat: 65, nps: 52 },
      { mes: "Dez", csat: 66, nps: 53 },
      { mes: "Jan", csat: 67, nps: 54 },
      { mes: "Fev", csat: 68, nps: 55 },
    ],
    tempo_resposta_mensal: generateTempoMensal(10.5),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(55, 5800, 78000, 60.5, 21.0, 18.5),
  },
  7: {
    nps_score: 68,
    csat_score: 78,
    csat_mes_anterior: 75,
    ces_score: 78.4,
    tempo_medio_resposta: "7:20",
    tempo_mes_anterior: "8:40",
    total_clientes: 11500,
    promotores: { percentual: 72.0, quantidade: 8280 },
    neutros: { percentual: 17.5, quantidade: 2013 },
    detratores: { percentual: 10.5, quantidade: 1208 },
    evolucao_mensal: [
      { mes: "Set", csat: 73, nps: 63 },
      { mes: "Out", csat: 74, nps: 64 },
      { mes: "Nov", csat: 75, nps: 65 },
      { mes: "Dez", csat: 76, nps: 66 },
      { mes: "Jan", csat: 77, nps: 67 },
      { mes: "Fev", csat: 78, nps: 68 },
    ],
    tempo_resposta_mensal: generateTempoMensal(7.3),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(68, 7200, 92000, 72.0, 17.5, 10.5),
  },
  8: {
    nps_score: 50,
    csat_score: 64,
    csat_mes_anterior: 61,
    ces_score: 60.2,
    tempo_medio_resposta: "12:00",
    tempo_mes_anterior: "13:25",
    total_clientes: 7800,
    promotores: { percentual: 58.0, quantidade: 4524 },
    neutros: { percentual: 22.5, quantidade: 1755 },
    detratores: { percentual: 19.5, quantidade: 1521 },
    evolucao_mensal: [
      { mes: "Set", csat: 59, nps: 45 },
      { mes: "Out", csat: 60, nps: 46 },
      { mes: "Nov", csat: 61, nps: 47 },
      { mes: "Dez", csat: 62, nps: 48 },
      { mes: "Jan", csat: 63, nps: 49 },
      { mes: "Fev", csat: 64, nps: 50 },
    ],
    tempo_resposta_mensal: generateTempoMensal(12),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(50, 4800, 68000, 58.0, 22.5, 19.5),
  },
  9: {
    nps_score: 42,
    csat_score: 60,
    csat_mes_anterior: 57,
    ces_score: 52.6,
    tempo_medio_resposta: "15:10",
    tempo_mes_anterior: "17:00",
    total_clientes: 5500,
    promotores: { percentual: 50.0, quantidade: 2750 },
    neutros: { percentual: 24.0, quantidade: 1320 },
    detratores: { percentual: 26.0, quantidade: 1430 },
    evolucao_mensal: [
      { mes: "Set", csat: 55, nps: 37 },
      { mes: "Out", csat: 56, nps: 38 },
      { mes: "Nov", csat: 57, nps: 39 },
      { mes: "Dez", csat: 58, nps: 40 },
      { mes: "Jan", csat: 59, nps: 41 },
      { mes: "Fev", csat: 60, nps: 42 },
    ],
    tempo_resposta_mensal: generateTempoMensal(15.2),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(42, 4200, 71000, 50.0, 24.0, 26.0),
  },
  10: {
    nps_score: 74,
    csat_score: 82,
    csat_mes_anterior: 80,
    ces_score: 85.3,
    tempo_medio_resposta: "5:45",
    tempo_mes_anterior: "6:50",
    total_clientes: 6200,
    promotores: { percentual: 78.5, quantidade: 4867 },
    neutros: { percentual: 14.0, quantidade: 868 },
    detratores: { percentual: 7.5, quantidade: 465 },
    evolucao_mensal: [
      { mes: "Set", csat: 77, nps: 69 },
      { mes: "Out", csat: 78, nps: 70 },
      { mes: "Nov", csat: 79, nps: 71 },
      { mes: "Dez", csat: 80, nps: 72 },
      { mes: "Jan", csat: 81, nps: 73 },
      { mes: "Fev", csat: 82, nps: 74 },
    ],
    tempo_resposta_mensal: generateTempoMensal(5.75),
    satisfacao_breakdown: generateBreakdown(),
    comparativo: generateComparativo(74, 4000, 55000, 78.5, 14.0, 7.5),
  },
};

export function getMetricasProduto(produtoId: number): ProdutoMetricas {
  return metricasPorProduto[produtoId] || metricasPorProduto[1];
}
