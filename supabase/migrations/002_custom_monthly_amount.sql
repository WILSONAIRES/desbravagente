-- Migration: Add custom_monthly_amount to profiles

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='custom_monthly_amount') THEN
        ALTER TABLE profiles ADD COLUMN custom_monthly_amount TEXT;
    END IF;
END $$;
