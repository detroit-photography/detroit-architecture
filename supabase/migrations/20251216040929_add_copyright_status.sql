-- Add copyright_status column to nrhp_images
ALTER TABLE nrhp_images 
ADD COLUMN IF NOT EXISTS copyright_status TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN nrhp_images.copyright_status IS 'Copyright status: public_domain, public_domain_nrhp, or fair_use';

