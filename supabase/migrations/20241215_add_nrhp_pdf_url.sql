-- Add pdf_url field to nrhp_entries table
ALTER TABLE nrhp_entries ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Comment explaining the field
COMMENT ON COLUMN nrhp_entries.pdf_url IS 'URL to the original NRHP nomination form PDF';

