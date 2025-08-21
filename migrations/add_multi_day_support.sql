-- Add multi-day support columns to dishes table
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS servings_per_dish INTEGER DEFAULT 1;
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS servings_per_person INTEGER DEFAULT 1;
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS can_be_multi_day BOOLEAN DEFAULT false;
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS storage_days INTEGER DEFAULT 1;

-- Add comments for clarity
COMMENT ON COLUMN dishes.servings_per_dish IS 'How many servings this dish provides when prepared once';
COMMENT ON COLUMN dishes.servings_per_person IS 'How many servings one person typically needs for one meal';
COMMENT ON COLUMN dishes.can_be_multi_day IS 'Whether this dish can span multiple days (e.g., pie, casserole)';
COMMENT ON COLUMN dishes.storage_days IS 'Maximum number of days this dish can be stored and consumed';

-- Update some example dishes to showcase multi-day capability
UPDATE dishes SET 
  servings_per_dish = 8,
  servings_per_person = 1,
  can_be_multi_day = true,
  storage_days = 3
WHERE name ILIKE '%tarte%' OR name ILIKE '%pie%' OR name ILIKE '%quiche%';

UPDATE dishes SET 
  servings_per_dish = 6,
  servings_per_person = 1,
  can_be_multi_day = true,
  storage_days = 4
WHERE name ILIKE '%lasagne%' OR name ILIKE '%gratin%' OR name ILIKE '%casserole%';

UPDATE dishes SET 
  servings_per_dish = 4,
  servings_per_person = 1,
  can_be_multi_day = true,
  storage_days = 2
WHERE name ILIKE '%soup%' OR name ILIKE '%soupe%' OR name ILIKE '%stew%' OR name ILIKE '%ragoût%';