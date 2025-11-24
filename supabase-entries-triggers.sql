-- Triggers para atualizar automaticamente o estoque e preço médio dos materiais
-- Execute este SQL no SQL Editor do Supabase

-- Função para atualizar estoque e preço médio do material
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

  -- Calcular total de saídas do material (se a tabela outputs existir)
  BEGIN
    SELECT COALESCE(SUM(quantity), 0) INTO total_outputs
    FROM outputs
    WHERE material_id = material_id_to_update;
  EXCEPTION
    WHEN undefined_table THEN
      total_outputs := 0;
  END;

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
    average_price := total_value / total_quantity;
  ELSE
    -- Se não houver entradas, manter o preço atual ou usar 0
    SELECT unit_price INTO average_price
    FROM materials
    WHERE id = material_id_to_update;
    
    IF average_price IS NULL THEN
      average_price := 0;
    END IF;
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

-- Trigger para INSERT (criar entrada)
DROP TRIGGER IF EXISTS trigger_update_material_on_entry_insert ON entries;
CREATE TRIGGER trigger_update_material_on_entry_insert
  AFTER INSERT ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_material_stock_and_price();

-- Trigger para UPDATE (atualizar entrada)
DROP TRIGGER IF EXISTS trigger_update_material_on_entry_update ON entries;
CREATE TRIGGER trigger_update_material_on_entry_update
  AFTER UPDATE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_material_stock_and_price();

-- Trigger para DELETE (excluir entrada)
DROP TRIGGER IF EXISTS trigger_update_material_on_entry_delete ON entries;
CREATE TRIGGER trigger_update_material_on_entry_delete
  AFTER DELETE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_material_stock_and_price();

-- Comentário
COMMENT ON FUNCTION update_material_stock_and_price() IS 'Atualiza automaticamente o estoque e preço médio do material quando entradas são criadas, atualizadas ou excluídas';

