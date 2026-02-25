-- Enable RLS on pathfinder_specialties
ALTER TABLE pathfinder_specialties ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of specialties') THEN
        CREATE POLICY "Allow public read of specialties" ON pathfinder_specialties
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin write of specialties') THEN
        CREATE POLICY "Allow admin write of specialties" ON pathfinder_specialties
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;
