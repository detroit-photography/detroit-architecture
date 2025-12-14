-- Create NRHP entries table
CREATE TABLE IF NOT EXISTS nrhp_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    ref_number TEXT NOT NULL UNIQUE,
    date_listed DATE,
    level_of_significance TEXT,
    areas_of_significance TEXT[],
    period_of_significance TEXT,
    description TEXT,
    statement_of_significance TEXT,
    architect_builder TEXT
);

-- Enable RLS
ALTER TABLE nrhp_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON nrhp_entries FOR SELECT USING (true);

-- Create index for building lookup
CREATE INDEX idx_nrhp_building_id ON nrhp_entries(building_id);
