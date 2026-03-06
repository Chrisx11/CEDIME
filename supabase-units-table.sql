-- Tabela de Unidades para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela units
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_units_name ON units(name);

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
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_units_updated_at'
  ) THEN
    CREATE TRIGGER update_units_updated_at
      BEFORE UPDATE ON units
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam unidades
CREATE POLICY "Usuários autenticados podem ler unidades"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem unidades
CREATE POLICY "Usuários autenticados podem criar unidades"
  ON units
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem unidades
CREATE POLICY "Usuários autenticados podem atualizar unidades"
  ON units
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam unidades
CREATE POLICY "Usuários autenticados podem excluir unidades"
  ON units
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE units IS 'Tabela de unidades de medida para materiais escolares';
COMMENT ON COLUMN units.id IS 'Identificador único da unidade';
COMMENT ON COLUMN units.name IS 'Nome da unidade (único)';
COMMENT ON COLUMN units.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN units.updated_at IS 'Data da última atualização do registro';

-- Inserir unidades padrão
INSERT INTO units (name) VALUES 
  ('unidade'),
  ('caixa'),
  ('resma'),
  ('metro'),
  ('quilograma'),
  ('litro')
ON CONFLICT (name) DO NOTHING;

