-- ==============================================================================
-- MIGRATION: ALTER sizes COLUMN TO jsonb AND POPULATE REALISTIC STATUS/ADDONS
-- ==============================================================================

-- 1. Alter the column to jsonb safely
ALTER TABLE public.products ALTER COLUMN sizes DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN sizes TYPE jsonb USING to_jsonb(sizes);
ALTER TABLE public.products ALTER COLUMN sizes SET DEFAULT '[]'::jsonb;

-- 2. Update specific test product (00000001-0001-0912-2025-000000000002)
-- S: Available (same price, +0)
-- M: Available (+50 addon)
-- L: Not Available / Out of stock (+0)
-- XL: Coming Soon (+100 addon)
UPDATE public.products
SET sizes = '[
  ["S", "AVAILABLE", 0],
  ["M", "AVAILABLE", 50],
  ["L", "NOT AVAILABLE", 0],
  ["XL", "COMING SOON", 100]
]'::jsonb
WHERE id = '00000001-0001-0912-2025-000000000002';

-- 3. Automatically transform all existing products that currently have string sizes
-- Converts plain ["S", "M", "L", "XL"] into varied statuses (AVAILABLE, NOT AVAILABLE, COMING SOON) and price addons
DO $$
DECLARE
  prod RECORD;
  old_elem text;
  new_sizes jsonb;
  idx int;
  status_val text;
  addon_val int;
BEGIN
  FOR prod IN 
    SELECT id, sizes 
    FROM public.products 
    WHERE jsonb_typeof(sizes) = 'array' 
      AND jsonb_array_length(sizes) > 0 
      AND id != '00000001-0001-0912-2025-000000000002'
  LOOP
    -- Only convert if elements are plain strings (not already structured arrays)
    IF jsonb_typeof(prod.sizes->0) = 'string' AND NOT ((prod.sizes->>0) LIKE '[%') THEN
      new_sizes := '[]'::jsonb;
      idx := 0;
      FOR old_elem IN SELECT jsonb_array_elements_text(prod.sizes)
      LOOP
        -- Distribute realistic statuses and addons:
        -- 1st size: AVAILABLE, +0
        -- 2nd size: AVAILABLE, +50
        -- 3rd size: NOT AVAILABLE, +0
        -- 4th size: COMING SOON, +100
        -- 5th+ size: AVAILABLE, +150
        IF idx = 0 THEN
          status_val := 'AVAILABLE';
          addon_val := 0;
        ELSIF idx = 1 THEN
          status_val := 'AVAILABLE';
          addon_val := 50;
        ELSIF idx = 2 THEN
          status_val := 'NOT AVAILABLE';
          addon_val := 0;
        ELSIF idx = 3 THEN
          status_val := 'COMING SOON';
          addon_val := 100;
        ELSE
          status_val := 'AVAILABLE';
          addon_val := 150;
        END IF;

        new_sizes := new_sizes || jsonb_build_array(jsonb_build_array(old_elem, status_val, addon_val));
        idx := idx + 1;
      END LOOP;

      UPDATE public.products
      SET sizes = new_sizes
      WHERE id = prod.id;
    END IF;
  END LOOP;
END $$;

