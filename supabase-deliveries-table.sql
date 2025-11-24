-- Tabela de Entregas de Materiais
-- Execute este SQL no SQL Editor do Supabase

-- Criar tabela deliveries
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL, -- Denormalizado para facilitar consultas
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'cancelled')),
  total_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_deliveries_supplier_id ON deliveries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_delivery_date ON deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_deliveries_delivery_number ON deliveries(delivery_number);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_deliveries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_deliveries_updated_at();

-- Habilitar Row Level Security (RLS)
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela deliveries
CREATE POLICY "Users can view deliveries"
  ON deliveries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert deliveries"
  ON deliveries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update deliveries"
  ON deliveries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete deliveries"
  ON deliveries
  FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de Itens de Entrega
-- Criar tabela delivery_items
CREATE TABLE IF NOT EXISTS delivery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL, -- Denormalizado para facilitar consultas
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_delivery_items_delivery_id ON delivery_items(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_items_material_id ON delivery_items(material_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela delivery_items
CREATE POLICY "Users can view delivery_items"
  ON delivery_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert delivery_items"
  ON delivery_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update delivery_items"
  ON delivery_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete delivery_items"
  ON delivery_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários
COMMENT ON TABLE deliveries IS 'Registra as entregas de materiais dos fornecedores';
COMMENT ON COLUMN deliveries.delivery_number IS 'Número único da entrega (ex: ENT-000001)';
COMMENT ON COLUMN deliveries.supplier_id IS 'ID do fornecedor que fez a entrega';
COMMENT ON COLUMN deliveries.supplier_name IS 'Nome do fornecedor (denormalizado para performance)';
COMMENT ON COLUMN deliveries.delivery_date IS 'Data em que a entrega foi/será realizada';
COMMENT ON COLUMN deliveries.status IS 'Status da entrega: pending, received, cancelled';
COMMENT ON COLUMN deliveries.total_value IS 'Valor total da entrega';

COMMENT ON TABLE delivery_items IS 'Itens de cada entrega';
COMMENT ON COLUMN delivery_items.delivery_id IS 'ID da entrega à qual o item pertence';
COMMENT ON COLUMN delivery_items.material_id IS 'ID do material entregue';
COMMENT ON COLUMN delivery_items.material_name IS 'Nome do material (denormalizado para performance)';
COMMENT ON COLUMN delivery_items.quantity IS 'Quantidade entregue';
COMMENT ON COLUMN delivery_items.unit_price IS 'Preço unitário do material no momento da entrega';
COMMENT ON COLUMN delivery_items.total IS 'Valor total do item (quantity * unit_price)';

