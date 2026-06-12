export type TipoEvento =
  | "aniversario"
  | "casamento"
  | "cha_bebe"
  | "cha_revelacao"
  | "formatura"
  | "batizado"
  | "corporativo"
  | "outro";

export type Plano = "basico" | "premium" | "luxo";

export type StatusPagamento = "pendente" | "pago" | "cancelado" | "reembolsado";

export type StatusRsvp = "confirmado" | "recusado" | "talvez";

export interface TemaConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  fontFamily: string;
  emoji: string;
  animations: string[];
  bgPattern: string;
}

export interface Tema {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  tipo_evento: TipoEvento;
  thumbnail_url: string | null;
  config: TemaConfig;
  ativo: boolean;
  ordem: number;
  created_at: string;
}

export interface Convite {
  id: string;
  slug: string;
  cliente_id: string | null;
  tema_id: string | null;
  plano: Plano;
  nome_anfitriao: string;
  titulo_evento: string;
  data_evento: string;
  local_nome: string | null;
  local_endereco: string | null;
  local_maps_url: string | null;
  mensagem: string | null;
  foto_url: string | null;
  musica_url: string | null;
  cores: Record<string, string>;
  config_extra: Record<string, unknown>;
  status_pagamento: StatusPagamento;
  valor_pago: number | null;
  payment_id: string | null;
  paid_at: string | null;
  visualizacoes: number;
  ativo: boolean;
  expira_em: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  tema?: Tema;
  rsvps?: Rsvp[];
}

export interface Rsvp {
  id: string;
  convite_id: string;
  nome: string;
  telefone: string | null;
  acompanhantes: number;
  status: StatusRsvp;
  mensagem: string | null;
  created_at: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  created_at: string;
}

export const PLANO_PRECOS: Record<Plano, number> = {
  basico: 29,
  premium: 59,
  luxo: 99,
};

export const PLANO_FEATURES: Record<Plano, string[]> = {
  basico: [
    "Convite com design exclusivo",
    "Link compartilhavel",
    "Contagem regressiva",
    "Dados do evento + mapa",
  ],
  premium: [
    "Tudo do Basico",
    "Confirmacao de presenca (RSVP)",
    "Contagem regressiva animada",
    "Animacoes especiais",
    "Suporte por WhatsApp",
  ],
  luxo: [
    "Tudo do Premium",
    "Musica de fundo",
    "Galeria de fotos",
    "Efeitos visuais exclusivos",
    "Mensagem personalizada animada",
    "Suporte prioritario",
  ],
};

export const TIPO_EVENTO_LABELS: Record<TipoEvento, string> = {
  aniversario: "Aniversario",
  casamento: "Casamento",
  cha_bebe: "Cha de Bebe",
  cha_revelacao: "Cha Revelacao",
  formatura: "Formatura",
  batizado: "Batizado",
  corporativo: "Corporativo",
  outro: "Outro",
};
