-- Create NRHP images table for historic photographs extracted from PDF nomination forms
-- Each image has editable metadata and links to both the NRHP entry and building

CREATE TABLE IF NOT EXISTS nrhp_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Relationships
    nrhp_entry_id UUID REFERENCES nrhp_entries(id) ON DELETE CASCADE,
    building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
    
    -- Image file info
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,  -- Path relative to /data/nrhp/images/
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    format TEXT,  -- jpeg, png, tiff, etc.
    
    -- Source information (from PDF extraction)
    source_pdf TEXT NOT NULL,  -- Original PDF filename
    source_page INTEGER NOT NULL,  -- Page number in PDF (1-indexed)
    extraction_method TEXT,  -- 'pymupdf', 'pdfimages', 'manual', etc.
    
    -- NRHP Caption fields (extracted from PDF, editable)
    original_caption TEXT,  -- Caption as it appears in the NRHP PDF
    cleaned_caption TEXT,  -- Cleaned/corrected version for display
    
    -- Photo metadata (editable)
    title TEXT,  -- User-editable title
    description TEXT,  -- User-editable description
    photographer TEXT,  -- Name of photographer if known
    photo_date TEXT,  -- Date photo was taken (as text, could be "circa 1889" etc.)
    photo_year INTEGER,  -- Year if known precisely
    photo_era TEXT,  -- "1880s", "early 1900s", "1920s", etc.
    
    -- Subject/content metadata
    view_type TEXT,  -- 'exterior', 'interior', 'detail', 'aerial', 'streetscape'
    view_direction TEXT,  -- 'north', 'south', 'east', 'west', 'northeast', etc.
    features_shown TEXT[],  -- Array: ['facade', 'tower', 'entrance', 'fireplace', etc.]
    
    -- Rights and attribution
    copyright_status TEXT DEFAULT 'public_domain',  -- 'public_domain', 'owned', 'licensed', 'unknown'
    credit_line TEXT,  -- Required attribution text
    source_archive TEXT,  -- 'NRHP', 'Library of Congress', 'Burton Historical Collection', etc.
    archive_reference TEXT,  -- Archive-specific reference number
    
    -- Display settings
    is_primary BOOLEAN DEFAULT FALSE,  -- Primary image for this building
    is_published BOOLEAN DEFAULT TRUE,  -- Whether to show on public site
    display_order INTEGER DEFAULT 0,  -- Order in gallery
    
    -- Quality/processing flags
    needs_review BOOLEAN DEFAULT TRUE,  -- Flag for admin review
    quality_score INTEGER,  -- 1-5 rating for image quality
    processing_notes TEXT,  -- Notes about extraction/processing issues
    
    -- For soft delete and audit trail
    deleted_at TIMESTAMPTZ,
    last_edited_by TEXT,
    edit_history JSONB DEFAULT '[]'::jsonb  -- Array of {timestamp, field, old_value, new_value, editor}
);

-- Enable RLS
ALTER TABLE nrhp_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only published, non-deleted images)
CREATE POLICY "Allow public read access" ON nrhp_images 
    FOR SELECT USING (is_published = TRUE AND deleted_at IS NULL);

-- Create policy for authenticated write access (for admin)
CREATE POLICY "Allow authenticated write access" ON nrhp_images 
    FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for common queries
CREATE INDEX idx_nrhp_images_entry_id ON nrhp_images(nrhp_entry_id);
CREATE INDEX idx_nrhp_images_building_id ON nrhp_images(building_id);
CREATE INDEX idx_nrhp_images_source_pdf ON nrhp_images(source_pdf);
CREATE INDEX idx_nrhp_images_is_primary ON nrhp_images(building_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_nrhp_images_needs_review ON nrhp_images(needs_review) WHERE needs_review = TRUE;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nrhp_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER nrhp_images_updated_at
    BEFORE UPDATE ON nrhp_images
    FOR EACH ROW
    EXECUTE FUNCTION update_nrhp_images_updated_at();

-- Add comment explaining the table
COMMENT ON TABLE nrhp_images IS 'Historic photographs extracted from NRHP nomination PDFs with editable metadata';
COMMENT ON COLUMN nrhp_images.original_caption IS 'Caption text exactly as it appears in the NRHP PDF';
COMMENT ON COLUMN nrhp_images.cleaned_caption IS 'Cleaned/corrected version for public display';
COMMENT ON COLUMN nrhp_images.edit_history IS 'Audit trail of all edits as JSON array';

