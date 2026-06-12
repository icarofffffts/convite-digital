-- ============================================
-- Schema: convites
-- Plataforma de Convites Digitais Interativos
-- ============================================

CREATE SCHEMA IF NOT EXISTS convites;

-- Tipos ENUM
CREATE TYPE convites.tipo_evento AS ENUM (
  'aniversario',
  'casamento',
  'cha_bebe',
  'cha_revelacao',
  'formatura',
  'batizado',
  'corporativo',
  'outro'
);

CREATE TYPE convites.plano AS ENUM ('basico', 'premium', 'luxo');

CREATE TYPE convites.status_pagamento AS ENUM ('pendente', 'pago', 'cancelado', 'reembolsado');

CREATE TYPE convites.status_rsvp AS ENUM ('confirmado', 'recusado', 'talvez');

-- ============================================
-- Tabela: convites.clientes
-- ============================================
CREATE TABLE convites.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clientes_email ON convites.clientes(email);

-- ============================================
-- Tabela: convites.temas
-- ============================================
CREATE TABLE convites.temas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  tipo_evento convites.tipo_evento NOT NULL,
  thumbnail_url TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_temas_tipo ON convites.temas(tipo_evento);
CREATE INDEX idx_temas_slug ON convites.temas(slug);

-- ============================================
-- Tabela: convites.convites
-- ============================================
CREATE TABLE convites.convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(20) NOT NULL UNIQUE,
  cliente_id UUID REFERENCES convites.clientes(id) ON DELETE SET NULL,
  tema_id UUID REFERENCES convites.temas(id) ON DELETE SET NULL,
  plano convites.plano NOT NULL DEFAULT 'basico',

  -- Dados do evento
  nome_anfitriao VARCHAR(200) NOT NULL,
  titulo_evento VARCHAR(300) NOT NULL,
  data_evento TIMESTAMPTZ NOT NULL,
  local_nome VARCHAR(300),
  local_endereco TEXT,
  local_maps_url TEXT,
  mensagem TEXT,
  foto_url TEXT,
  musica_url TEXT,

  -- Personalização
  cores JSONB DEFAULT '{}',
  config_extra JSONB DEFAULT '{}',

  -- Pagamento
  status_pagamento convites.status_pagamento DEFAULT 'pendente',
  valor_pago DECIMAL(10,2),
  payment_id VARCHAR(255),
  paid_at TIMESTAMPTZ,

  -- Controle
  visualizacoes INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  expira_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_convites_slug ON convites.convites(slug);
CREATE INDEX idx_convites_cliente ON convites.convites(cliente_id);
CREATE INDEX idx_convites_status ON convites.convites(status_pagamento);

-- ============================================
-- Tabela: convites.rsvp
-- ============================================
CREATE TABLE convites.rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  convite_id UUID NOT NULL REFERENCES convites.convites(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  telefone VARCHAR(20),
  acompanhantes INT DEFAULT 0,
  status convites.status_rsvp NOT NULL DEFAULT 'confirmado',
  mensagem TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rsvp_convite ON convites.rsvp(convite_id);

-- ============================================
-- Tabela: convites.pagamentos
-- ============================================
CREATE TABLE convites.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  convite_id UUID NOT NULL REFERENCES convites.convites(id) ON DELETE CASCADE,
  metodo VARCHAR(50) NOT NULL DEFAULT 'pix',
  valor DECIMAL(10,2) NOT NULL,
  status convites.status_pagamento DEFAULT 'pendente',
  external_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pagamentos_convite ON convites.pagamentos(convite_id);
CREATE INDEX idx_pagamentos_external ON convites.pagamentos(external_id);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE convites.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites.temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites.convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites.pagamentos ENABLE ROW LEVEL SECURITY;

-- Temas: leitura pública (apenas ativos)
CREATE POLICY "temas_public_read" ON convites.temas
  FOR SELECT USING (ativo = true);

-- Convites: leitura pública (apenas pagos e ativos)
CREATE POLICY "convites_public_read" ON convites.convites
  FOR SELECT USING (ativo = true AND status_pagamento = 'pago');

-- RSVP: qualquer um pode inserir (confirmar presença)
CREATE POLICY "rsvp_public_insert" ON convites.rsvp
  FOR INSERT WITH CHECK (true);

-- RSVP: leitura vinculada ao convite público
CREATE POLICY "rsvp_public_read" ON convites.rsvp
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM convites.convites c
      WHERE c.id = convite_id AND c.ativo = true
    )
  );

-- Service role tem acesso total (para API backend)
CREATE POLICY "service_full_access_clientes" ON convites.clientes
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_full_access_temas" ON convites.temas
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_full_access_convites" ON convites.convites
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_full_access_rsvp" ON convites.rsvp
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_full_access_pagamentos" ON convites.pagamentos
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Função: incrementar visualizações
-- ============================================
CREATE OR REPLACE FUNCTION convites.incrementar_views(convite_slug VARCHAR)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE convites.convites
  SET visualizacoes = visualizacoes + 1
  WHERE slug = convite_slug AND ativo = true;
END;
$$;

-- ============================================
-- Seed: Temas iniciais
-- ============================================
INSERT INTO convites.temas (nome, slug, descricao, tipo_evento, config) VALUES
(
  'Festa Tropical',
  'festa-tropical',
  'Tema vibrante com cores tropicais, perfeito para aniversarios ao ar livre',
  'aniversario',
  '{
    "primaryColor": "#FF6B35",
    "secondaryColor": "#F7C948",
    "accentColor": "#2D9CDB",
    "bgGradient": "from-orange-400 via-pink-500 to-purple-600",
    "fontFamily": "Poppins",
    "emoji": "🎉",
    "animations": ["confetti", "float"],
    "bgPattern": "tropical"
  }'::jsonb
),
(
  'Romance Elegante',
  'romance-elegante',
  'Tema sofisticado em tons rose e dourado para casamentos',
  'casamento',
  '{
    "primaryColor": "#B76E79",
    "secondaryColor": "#D4AF37",
    "accentColor": "#FAF0E6",
    "bgGradient": "from-rose-100 via-pink-50 to-amber-50",
    "fontFamily": "Playfair Display",
    "emoji": "💍",
    "animations": ["petals", "sparkle"],
    "bgPattern": "floral"
  }'::jsonb
),
(
  'Mundo Baby',
  'mundo-baby',
  'Tema delicado e fofo em tons pastel para cha de bebe',
  'cha_bebe',
  '{
    "primaryColor": "#A8D8EA",
    "secondaryColor": "#FFCAD4",
    "accentColor": "#F5E6CC",
    "bgGradient": "from-blue-100 via-pink-100 to-yellow-50",
    "fontFamily": "Quicksand",
    "emoji": "👶",
    "animations": ["stars", "float"],
    "bgPattern": "clouds"
  }'::jsonb
);
