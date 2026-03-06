-- SQL para garantir que a coluna unit existe na tabela materials
-- Execute este SQL no SQL Editor do Supabase

-- Verificar se a coluna unit existe, se não existir, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'unit'
  ) THEN
    ALTER TABLE materials 
    ADD COLUMN unit VARCHAR(50) NOT NULL DEFAULT 'unidade';
    
    -- Adicionar comentário na coluna
    COMMENT ON COLUMN materials.unit IS 'Unidade de medida (ex: unidade, caixa, pacote, etc.)';
  END IF;
END $$;

-- Verificar se a coluna está na posição correta (após min_quantity)
-- Nota: PostgreSQL não permite reordenar colunas diretamente,
-- mas podemos garantir que a coluna existe e tem as propriedades corretas
DO $$
BEGIN
  -- Garantir que a coluna tem o valor padrão correto
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'materials' 
    AND column_name = 'unit'
  ) THEN
    -- Atualizar valores NULL para o padrão se necessário
    UPDATE materials 
    SET unit = 'unidade' 
    WHERE unit IS NULL;
    
    -- Garantir que a coluna não aceita NULL
    ALTER TABLE materials 
    ALTER COLUMN unit SET NOT NULL,
    ALTER COLUMN unit SET DEFAULT 'unidade';
  END IF;
END $$;

