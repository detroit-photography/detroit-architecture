-- Create shoots table for photography shoots
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS shoots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT, -- e.g., "December 2024"
  building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
  location_name TEXT, -- Denormalized for display
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  images JSONB DEFAULT '[]', -- Array of {src, alt, caption}
  published BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS shoots_building_id_idx ON shoots(building_id);
CREATE INDEX IF NOT EXISTS shoots_slug_idx ON shoots(slug);
CREATE INDEX IF NOT EXISTS shoots_published_idx ON shoots(published);

-- Enable RLS (Row Level Security)
ALTER TABLE shoots ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published shoots
CREATE POLICY "Anyone can read published shoots"
  ON shoots
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can do everything
CREATE POLICY "Authenticated users can manage shoots"
  ON shoots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shoots_updated_at
  BEFORE UPDATE ON shoots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant access
GRANT ALL ON shoots TO authenticated;
GRANT SELECT ON shoots TO anon;



