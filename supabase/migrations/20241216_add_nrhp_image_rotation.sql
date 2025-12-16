-- Add rotation column to nrhp_images table
ALTER TABLE nrhp_images ADD COLUMN IF NOT EXISTS rotation INTEGER DEFAULT 0;

COMMENT ON COLUMN nrhp_images.rotation IS 'Rotation in degrees (0, 90, 180, 270)';

