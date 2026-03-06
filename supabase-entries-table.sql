-- Tabela de Entradas de Materiais para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela entries
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  supplier_id UUID,
  supplier_name VARCHAR(255),
  reason TEXT DEFAULT '',
  responsible VARCHAR(255) NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por material_id
CREATE INDEX IF NOT EXISTS idx_entries_material_id ON entries(material_id);

-- Criar índice para busca por supplier_id
CREATE INDEX IF NOT EXISTS idx_entries_supplier_id ON entries(supplier_id);

-- Criar índice para busca por entry_date
CREATE INDEX IF NOT EXISTS idx_entries_entry_date ON entries(entry_date);

-- Criar índice para busca por responsible
CREATE INDEX IF NOT EXISTS idx_entries_responsible ON entries(responsible);

-- Criar índice composto para busca por data e material
CREATE INDEX IF NOT EXISTS idx_entries_date_material ON entries(entry_date, material_id);

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
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_entries_updated_at'
  ) THEN
    CREATE TRIGGER update_entries_updated_at
      BEFORE UPDATE ON entries
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam entradas
CREATE POLICY "Usuários autenticados podem ler entradas"
  ON entries
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem entradas
CREATE POLICY "Usuários autenticados podem criar entradas"
  ON entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem entradas
CREATE POLICY "Usuários autenticados podem atualizar entradas"
  ON entries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam entradas
CREATE POLICY "Usuários autenticados podem excluir entradas"
  ON entries
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE entries IS 'Tabela de entradas de materiais no estoque';
COMMENT ON COLUMN entries.id IS 'Identificador único da entrada';
COMMENT ON COLUMN entries.material_id IS 'ID do material (referência)';
COMMENT ON COLUMN entries.material_name IS 'Nome do material (denormalizado para performance)';
COMMENT ON COLUMN entries.quantity IS 'Quantidade de material entrando no estoque';
COMMENT ON COLUMN entries.unit IS 'Unidade de medida do material';
COMMENT ON COLUMN entries.unit_price IS 'Preço unitário do material na entrada';
COMMENT ON COLUMN entries.supplier_id IS 'ID do fornecedor (opcional)';
COMMENT ON COLUMN entries.supplier_name IS 'Nome do fornecedor (denormalizado para performance)';
COMMENT ON COLUMN entries.reason IS 'Motivo da entrada (opcional)';
COMMENT ON COLUMN entries.responsible IS 'Nome do responsável pela entrada';
COMMENT ON COLUMN entries.entry_date IS 'Data da entrada do material';
COMMENT ON COLUMN entries.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN entries.updated_at IS 'Data da última atualização do registro';

