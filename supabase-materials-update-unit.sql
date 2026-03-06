-- Script para atualizar a unidade de 'un' para 'Unidade' na tabela materials
-- Execute este SQL no SQL Editor do Supabase

-- Atualizar todos os registros que têm 'un' como unidade para 'Unidade'
UPDATE materials
SET unit = 'Unidade'
WHERE unit = 'un';

-- Verificar quantos registros foram atualizados (opcional)
-- SELECT COUNT(*) FROM materials WHERE unit = 'Unidade';

-- Comentário
COMMENT ON COLUMN materials.unit IS 'Unidade de medida do material (ex: Unidade, caixa, resma, etc.)';

