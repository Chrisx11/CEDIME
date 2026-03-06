-- Remover colunas CNPJ, Email, Address e Type da tabela institutions
-- Execute este SQL no SQL Editor do Supabase

-- Remover índices relacionados às colunas que serão removidas
DROP INDEX IF EXISTS idx_institutions_cnpj_unique;
DROP INDEX IF EXISTS idx_institutions_cnpj;
DROP INDEX IF EXISTS idx_institutions_email;
DROP INDEX IF EXISTS idx_institutions_type;

-- Remover constraint UNIQUE do CNPJ se existir
ALTER TABLE institutions DROP CONSTRAINT IF EXISTS institutions_cnpj_key;

-- Remover colunas
ALTER TABLE institutions 
  DROP COLUMN IF EXISTS cnpj,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS type;

-- Comentário
COMMENT ON TABLE institutions IS 'Tabela de instituições educacionais (escolas, centros, etc.)';

