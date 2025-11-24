-- Tabela de Requisições de Materiais
-- Execute este SQL no SQL Editor do Supabase

-- Criar tabela requests
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  required_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela request_items (itens das requisições)
CREATE TABLE IF NOT EXISTS request_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para requests
CREATE INDEX IF NOT EXISTS idx_requests_institution_id ON requests(institution_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_required_date ON requests(required_date);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_request_number ON requests(request_number);

-- Criar índices para request_items
CREATE INDEX IF NOT EXISTS idx_request_items_request_id ON request_items(request_id);
CREATE INDEX IF NOT EXISTS idx_request_items_material_id ON request_items(material_id);

-- Trigger para atualizar updated_at em requests
CREATE OR REPLACE FUNCTION update_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_requests_updated_at();

-- Habilitar Row Level Security (RLS) em requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Users can view requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Users can insert requests"
  ON requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Users can update requests"
  ON requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Users can delete requests"
  ON requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Habilitar Row Level Security (RLS) em request_items
ALTER TABLE request_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Users can view request_items"
  ON request_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Users can insert request_items"
  ON request_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Users can update request_items"
  ON request_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Users can delete request_items"
  ON request_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários
COMMENT ON TABLE requests IS 'Registra as requisições de materiais das instituições';
COMMENT ON COLUMN requests.request_number IS 'Número único da requisição (ex: REQ-000001)';
COMMENT ON COLUMN requests.institution_id IS 'ID da instituição que solicitou';
COMMENT ON COLUMN requests.institution_name IS 'Nome da instituição (denormalizado para performance)';
COMMENT ON COLUMN requests.required_date IS 'Data em que o material é necessário';
COMMENT ON COLUMN requests.status IS 'Status da requisição: pending, approved, delivered, cancelled';
COMMENT ON COLUMN requests.total_value IS 'Valor total da requisição';

COMMENT ON TABLE request_items IS 'Itens de cada requisição';
COMMENT ON COLUMN request_items.request_id IS 'ID da requisição à qual o item pertence';
COMMENT ON COLUMN request_items.material_id IS 'ID do material solicitado';
COMMENT ON COLUMN request_items.material_name IS 'Nome do material (denormalizado para performance)';
COMMENT ON COLUMN request_items.quantity IS 'Quantidade solicitada';
COMMENT ON COLUMN request_items.unit_price IS 'Preço unitário do material no momento da requisição';
COMMENT ON COLUMN request_items.total IS 'Valor total do item (quantity * unit_price)';

