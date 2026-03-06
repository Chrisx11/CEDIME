-- Tabela de Categorias para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

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
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam categorias
CREATE POLICY "Usuários autenticados podem ler categorias"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem categorias
CREATE POLICY "Usuários autenticados podem criar categorias"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem categorias
CREATE POLICY "Usuários autenticados podem atualizar categorias"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam categorias
CREATE POLICY "Usuários autenticados podem excluir categorias"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE categories IS 'Tabela de categorias de materiais escolares';
COMMENT ON COLUMN categories.id IS 'Identificador único da categoria';
COMMENT ON COLUMN categories.name IS 'Nome da categoria (único)';
COMMENT ON COLUMN categories.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN categories.updated_at IS 'Data da última atualização do registro';

