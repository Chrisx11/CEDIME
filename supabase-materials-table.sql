-- Tabela de Materiais para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela materials
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'unidade',
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  min_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (min_quantity >= 0),
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);

-- Criar índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);

-- Criar índice para busca por quantidade (para alertas de estoque baixo)
CREATE INDEX IF NOT EXISTS idx_materials_quantity ON materials(quantity);

-- Criar índice composto para busca por categoria e nome
CREATE INDEX IF NOT EXISTS idx_materials_category_name ON materials(category, name);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at e last_update (reutiliza a função se já existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_materials_updated_at'
  ) THEN
    CREATE TRIGGER update_materials_updated_at
      BEFORE UPDATE ON materials
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger para atualizar last_update quando quantidade ou preço mudarem
CREATE OR REPLACE FUNCTION update_materials_last_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar last_update se quantidade ou preço mudaram
  IF OLD.quantity IS DISTINCT FROM NEW.quantity OR 
     OLD.unit_price IS DISTINCT FROM NEW.unit_price OR
     OLD.min_quantity IS DISTINCT FROM NEW.min_quantity THEN
    NEW.last_update = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_materials_last_update'
  ) THEN
    CREATE TRIGGER update_materials_last_update
      BEFORE UPDATE ON materials
      FOR EACH ROW
      EXECUTE FUNCTION update_materials_last_update();
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam materiais
CREATE POLICY "Usuários autenticados podem ler materiais"
  ON materials
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem materiais
CREATE POLICY "Usuários autenticados podem criar materiais"
  ON materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem materiais
CREATE POLICY "Usuários autenticados podem atualizar materiais"
  ON materials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam materiais
CREATE POLICY "Usuários autenticados podem excluir materiais"
  ON materials
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE materials IS 'Tabela de materiais escolares em estoque';
COMMENT ON COLUMN materials.id IS 'Identificador único do material';
COMMENT ON COLUMN materials.name IS 'Nome do material';
COMMENT ON COLUMN materials.category IS 'Categoria do material (ex: Papelaria, Limpeza, etc.)';
COMMENT ON COLUMN materials.unit IS 'Unidade de medida (ex: unidade, caixa, pacote, etc.)';
COMMENT ON COLUMN materials.quantity IS 'Quantidade atual em estoque';
COMMENT ON COLUMN materials.min_quantity IS 'Quantidade mínima necessária em estoque (para alertas)';
COMMENT ON COLUMN materials.unit_price IS 'Preço unitário do material';
COMMENT ON COLUMN materials.last_update IS 'Data da última atualização de quantidade ou preço';
COMMENT ON COLUMN materials.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN materials.updated_at IS 'Data da última atualização do registro';

