-- Detroit Architecture Repository Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buildings table
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Basic info
    name TEXT NOT NULL,
    alternate_names TEXT[] DEFAULT '{}',
    
    -- Location
    address TEXT,
    city TEXT DEFAULT 'Detroit',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    
    -- Building details
    architect TEXT,
    year_built INTEGER,
    year_demolished INTEGER,
    architectural_style TEXT,
    building_type TEXT,
    status TEXT DEFAULT 'extant' CHECK (status IN ('extant', 'demolished', 'unknown')),
    
    -- Source references
    aia_number TEXT,
    aia_text TEXT,
    ferry_number TEXT,
    ferry_text TEXT,
    
    -- User content
    photographer_notes TEXT,
    wikipedia_entry TEXT,
    
    -- Flags
    featured BOOLEAN DEFAULT FALSE
);

-- Photos table
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    photographer TEXT,
    year_taken INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    photo_type TEXT DEFAULT 'original' CHECK (photo_type IN ('original', 'historical', 'street_view'))
);

-- Create indexes for common queries
CREATE INDEX idx_buildings_name ON buildings(name);
CREATE INDEX idx_buildings_architect ON buildings(architect);
CREATE INDEX idx_buildings_year ON buildings(year_built);
CREATE INDEX idx_buildings_style ON buildings(architectural_style);
CREATE INDEX idx_buildings_status ON buildings(status);
CREATE INDEX idx_buildings_location ON buildings(lat, lng);
CREATE INDEX idx_photos_building ON photos(building_id);

-- Full text search
ALTER TABLE buildings ADD COLUMN fts tsvector 
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(architect, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(address, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(aia_text, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(ferry_text, '')), 'D')
    ) STORED;

CREATE INDEX idx_buildings_fts ON buildings USING GIN(fts);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON buildings
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON photos
    FOR SELECT USING (true);

-- Authenticated write access (for admin)
CREATE POLICY "Authenticated write access" ON buildings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access" ON photos
    FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket for photos
-- Note: Run this in the Supabase dashboard under Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('building-photos', 'building-photos', true);

-- Storage policy for public read
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'building-photos');
-- CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'building-photos' AND auth.role() = 'authenticated');


