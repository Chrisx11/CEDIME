-- Tabela de Saídas de Materiais
-- Execute este SQL no SQL Editor do Supabase

-- Criar tabela outputs
CREATE TABLE IF NOT EXISTS outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  institution_name TEXT,
  reason TEXT DEFAULT '',
  responsible TEXT NOT NULL,
  output_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_outputs_material_id ON outputs(material_id);
CREATE INDEX IF NOT EXISTS idx_outputs_institution_id ON outputs(institution_id);
CREATE INDEX IF NOT EXISTS idx_outputs_output_date ON outputs(output_date);
CREATE INDEX IF NOT EXISTS idx_outputs_created_at ON outputs(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_outputs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_outputs_updated_at
  BEFORE UPDATE ON outputs
  FOR EACH ROW
  EXECUTE FUNCTION update_outputs_updated_at();

-- Habilitar Row Level Security (RLS)
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Users can view outputs"
  ON outputs
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Users can insert outputs"
  ON outputs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Users can update outputs"
  ON outputs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Users can delete outputs"
  ON outputs
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários
COMMENT ON TABLE outputs IS 'Registra as saídas de materiais do estoque';
COMMENT ON COLUMN outputs.material_id IS 'ID do material que foi retirado';
COMMENT ON COLUMN outputs.material_name IS 'Nome do material (denormalizado para performance)';
COMMENT ON COLUMN outputs.quantity IS 'Quantidade retirada do estoque';
COMMENT ON COLUMN outputs.unit IS 'Unidade de medida';
COMMENT ON COLUMN outputs.institution_id IS 'ID da instituição que recebeu o material (opcional)';
COMMENT ON COLUMN outputs.institution_name IS 'Nome da instituição (denormalizado para performance)';
COMMENT ON COLUMN outputs.reason IS 'Motivo da saída';
COMMENT ON COLUMN outputs.responsible IS 'Nome do responsável pela saída';
COMMENT ON COLUMN outputs.output_date IS 'Data da saída do material';

