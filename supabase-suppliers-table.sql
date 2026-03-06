-- Tabela de Fornecedores para o CEDIME
-- Execute este SQL no SQL Editor do Supabase

-- Criar a tabela suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  phone VARCHAR(20),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por CNPJ
CREATE INDEX IF NOT EXISTS idx_suppliers_cnpj ON suppliers(cnpj);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- Criar índice para busca por status
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- Criar índice para busca por cidade e estado
CREATE INDEX IF NOT EXISTS idx_suppliers_location ON suppliers(city, state);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam fornecedores
CREATE POLICY "Usuários autenticados podem ler fornecedores"
  ON suppliers
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados criem fornecedores
CREATE POLICY "Usuários autenticados podem criar fornecedores"
  ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem fornecedores
CREATE POLICY "Usuários autenticados podem atualizar fornecedores"
  ON suppliers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir que usuários autenticados excluam fornecedores
CREATE POLICY "Usuários autenticados podem excluir fornecedores"
  ON suppliers
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários na tabela e colunas
COMMENT ON TABLE suppliers IS 'Tabela de fornecedores de materiais escolares';
COMMENT ON COLUMN suppliers.id IS 'Identificador único do fornecedor';
COMMENT ON COLUMN suppliers.name IS 'Nome do fornecedor';
COMMENT ON COLUMN suppliers.cnpj IS 'CNPJ do fornecedor (apenas números)';
COMMENT ON COLUMN suppliers.phone IS 'Telefone de contato do fornecedor';
COMMENT ON COLUMN suppliers.city IS 'Cidade do fornecedor';
COMMENT ON COLUMN suppliers.state IS 'Estado do fornecedor (sigla de 2 letras)';
COMMENT ON COLUMN suppliers.status IS 'Status do fornecedor: active ou inactive';
COMMENT ON COLUMN suppliers.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN suppliers.updated_at IS 'Data da última atualização do registro';

