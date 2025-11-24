-- Tabela de Instituições para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela institutions
CREATE TABLE IF NOT EXISTS institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('school', 'center', 'other')),
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  principal_name VARCHAR(255) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por CNPJ
CREATE INDEX IF NOT EXISTS idx_institutions_cnpj ON institutions(cnpj);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(name);

-- Criar índice para busca por tipo
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(type);

-- Criar índice para busca por status
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);

-- Criar índice para busca por cidade e estado
CREATE INDEX IF NOT EXISTS idx_institutions_location ON institutions(city, state);

-- Criar índice para busca por email
CREATE INDEX IF NOT EXISTS idx_institutions_email ON institutions(email);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at (reutiliza a função se já existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_institutions_updated_at'
  ) THEN
    CREATE TRIGGER update_institutions_updated_at
      BEFORE UPDATE ON institutions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam instituições
CREATE POLICY "Usuários autenticados podem ler instituições"
  ON institutions
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem instituições
CREATE POLICY "Usuários autenticados podem criar instituições"
  ON institutions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem instituições
CREATE POLICY "Usuários autenticados podem atualizar instituições"
  ON institutions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam instituições
CREATE POLICY "Usuários autenticados podem excluir instituições"
  ON institutions
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE institutions IS 'Tabela de instituições educacionais (escolas, centros, etc.)';
COMMENT ON COLUMN institutions.id IS 'Identificador único da instituição';
COMMENT ON COLUMN institutions.name IS 'Nome da instituição';
COMMENT ON COLUMN institutions.type IS 'Tipo da instituição: school (escola), center (centro) ou other (outro)';
COMMENT ON COLUMN institutions.cnpj IS 'CNPJ da instituição (apenas números)';
COMMENT ON COLUMN institutions.email IS 'Email de contato da instituição';
COMMENT ON COLUMN institutions.phone IS 'Telefone de contato da instituição';
COMMENT ON COLUMN institutions.address IS 'Endereço completo da instituição';
COMMENT ON COLUMN institutions.city IS 'Cidade da instituição';
COMMENT ON COLUMN institutions.state IS 'Estado da instituição (sigla de 2 letras)';
COMMENT ON COLUMN institutions.principal_name IS 'Nome do diretor/responsável pela instituição';
COMMENT ON COLUMN institutions.status IS 'Status da instituição: active ou inactive';
COMMENT ON COLUMN institutions.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN institutions.updated_at IS 'Data da última atualização do registro';

