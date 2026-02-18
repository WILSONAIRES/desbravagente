-- Create Pathfinder Classes table
CREATE TABLE IF NOT EXISTS pathfinder_classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    min_age INTEGER,
    color TEXT NOT NULL,
    type TEXT NOT NULL, -- 'regular' or 'advanced'
    sections JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE pathfinder_classes ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of classes') THEN
        CREATE POLICY "Allow public read of classes" ON pathfinder_classes
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin write of classes') THEN
        CREATE POLICY "Allow admin write of classes" ON pathfinder_classes
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;
