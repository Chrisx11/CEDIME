-- Script para corrigir o cálculo do preço médio
-- Quando não houver entradas, o preço médio deve ser zerado
-- Execute este SQL no SQL Editor do Supabase

-- Atualizar a função para zerar o preço médio quando não houver entradas
CREATE OR REPLACE FUNCTION update_material_stock_and_price()
RETURNS TRIGGER AS $$
DECLARE
  material_id_to_update UUID;
  total_entries DECIMAL(10, 2);
  total_outputs DECIMAL(10, 2);
  new_quantity DECIMAL(10, 2);
  total_value DECIMAL(10, 2);
  total_quantity DECIMAL(10, 2);
  average_price DECIMAL(10, 2);
BEGIN
  -- Determinar qual material atualizar
  IF TG_OP = 'DELETE' THEN
    material_id_to_update := OLD.material_id;
  ELSE
    material_id_to_update := NEW.material_id;
  END IF;

  -- Calcular total de entradas do material
  SELECT COALESCE(SUM(quantity), 0) INTO total_entries
  FROM entries
  WHERE material_id = material_id_to_update;

  -- Calcular total de saídas do material
  SELECT COALESCE(SUM(quantity), 0) INTO total_outputs
  FROM outputs
  WHERE material_id = material_id_to_update;

  -- Calcular novo estoque
  new_quantity := GREATEST(0, total_entries - total_outputs);

  -- Calcular preço médio ponderado
  SELECT 
    COALESCE(SUM(quantity * unit_price), 0),
    COALESCE(SUM(quantity), 0)
  INTO total_value, total_quantity
  FROM entries
  WHERE material_id = material_id_to_update;

  IF total_quantity > 0 THEN
    -- Se houver entradas, calcular a média ponderada
    average_price := total_value / total_quantity;
  ELSE
    -- Se não houver entradas, zerar o preço médio
    average_price := 0;
  END IF;

  -- Atualizar o material
  UPDATE materials
  SET 
    quantity = new_quantity,
    unit_price = average_price,
    last_update = NOW()
  WHERE id = material_id_to_update;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Comentário atualizado
COMMENT ON FUNCTION update_material_stock_and_price() IS 'Atualiza automaticamente o estoque e preço médio do material. Quando não houver entradas, o preço médio é zerado.';

