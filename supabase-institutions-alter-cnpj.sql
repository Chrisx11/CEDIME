-- Alterar coluna CNPJ para ser opcional (nullable)
-- Execute este SQL no SQL Editor do Supabase

-- Remover a constraint NOT NULL e UNIQUE do CNPJ
ALTER TABLE institutions 
  ALTER COLUMN cnpj DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS institutions_cnpj_key;

-- Criar índice único apenas para CNPJs não nulos (opcional)
CREATE UNIQUE INDEX IF NOT EXISTS idx_institutions_cnpj_unique 
  ON institutions(cnpj) 
  WHERE cnpj IS NOT NULL;

-- Comentário
COMMENT ON COLUMN institutions.cnpj IS 'CNPJ da instituição (apenas números). Opcional.';

