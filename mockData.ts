export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  nps_score: number;
  categoria: "Promotor" | "Neutro" | "Detrator";
  tipo: "Respondido" | "Calculado";
  regiao: string;
  produtos: string[];
  data_cadastro: string;
  endereco?: string;
}

export interface RegionalData {
  cidade: string;
  estado: string;
  lat: number;
  lng: number;
  nps_score: number;
  total_clientes: number;
  categoria_cor: "verde" | "amarelo" | "vermelho";
}

export interface MetricasGlobais {
  total_clientes: number;
  total_respondidos: number;
  total_calculados: number;
  nps_score: number;
  promotores: { quantidade: number; percentual: number };
  neutros: { quantidade: number; percentual: number };
  detratores: { quantidade: number; percentual: number };
}

export interface EvolucaoData {
  meses: string[];
  nps_respondido: number[];
  nps_calculado: number[];
}

export const clientes: Cliente[] = [
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

export const regioes: RegionalData[] = [
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

export const metricasGlobais: MetricasGlobais = {
  total_clientes: 90000,
  total_respondidos: 5000,
  total_calculados: 85000,
  nps_score: 55.95,
  promotores: { quantidade: 61000, percentual: 67.76 },
  neutros: { quantidade: 18387, percentual: 20.43 },
  detratores: { quantidade: 10629, percentual: 11.81 },
};

export const evolucaoData: EvolucaoData = {
  meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  nps_respondido: [52, 53, 54, 55, 56, 57],
  nps_calculado: [51, 52, 53, 54, 55, 56],
};

export function getNpsColor(score: number): string {
  if (score >= 9) return "var(--chart-promoter)";
  if (score >= 7) return "var(--chart-neutral)";
  return "var(--chart-detractor)";
}

export function getCategoriaColor(cat: "verde" | "amarelo" | "vermelho"): string {
  const map = { verde: "var(--chart-promoter)", amarelo: "var(--chart-neutral)", vermelho: "var(--chart-detractor)" };
  return map[cat];
}

export function maskCpf(cpf: string): string {
  return `***.***${cpf.slice(7)}`;
}


export const retornoApi = {
  "customer_id":"C00000004",
  "reference_date":"2024-09-14",
  "nps_score":7,
  "is_respondent":true,
  "birth_date":"1989-01-09",
  "gender":"M",
  "region":"Sudeste",
  "state":"RJ",
  "city":"Rio de Janeiro",
  "account_open_date":"2024-05-20",
  "segment":"Gold",
  "credit_score":null,
  "acquisition_channel":"Partner",
  "is_active":true,"tenure_days":117,
  "tenure_months":3.9,
  "age":35.70411,
  "segment_encoded":1,
  "region_encoded":3,
  "credit_score_filled":581.8,
  "plan_id":"POS_150GB",
  "contract_type":"12M",
  "has_loyalty_discount":false,
  "plan_type":"Postpaid",
  "monthly_price":199.99,
  "data_allowance_gb":150,
  "has_5g":true,
  "plan_type_encoded":2,
  "price_per_gb":1.3332666,
  "support_count":11,
  "support_handle_time_avg":278.63635,
  "support_wait_time_avg":98,
  "support_escalated_count":1,
  "support_fcr_rate":0.27272728,
  "support_sentiment_avg":0.05272727,
  "usage_data_avg":111742.38,
  "usage_data_total":1340908.6,
  "usage_voice_avg":225.74167,
  "usage_throttle_count":8,
  "usage_throttled_months":1,
  "network_drop_rate_avg":0.030458333,
  "network_download_avg":70.691666,
  "network_latency_avg":44.641666,
  "network_signal_avg":-82.925,
  "billing_avg_amount":279.15,
  "billing_overage_total":0,
  "billing_overage_count":0,
  "billing_overdue_count":0,
  "billing_dispute_count":0,
  "digital_event_count":0,
  "digital_success_rate":0.95238096,
  "marketing_touch_count":11,
  "marketing_conversions":1,
  "marketing_open_rate":0.09090909,
  "outage_count":5,
  "outage_exposure_total":686
}