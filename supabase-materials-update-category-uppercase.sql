-- Script para converter todas as categorias para maiúsculas na tabela materials
-- Execute este SQL no SQL Editor do Supabase

-- Atualizar todos os registros convertendo a categoria para maiúsculas
UPDATE materials
SET category = UPPER(category);

-- Verificar os resultados (opcional)
-- SELECT DISTINCT category FROM materials ORDER BY category;

-- Comentário
COMMENT ON COLUMN materials.category IS 'Categoria do material (em maiúsculas)';

