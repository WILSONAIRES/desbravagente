-- Migration: Add Trial Mode and AI Generation Limits

-- 1. Add `trial_ends_at` to the `profiles` table if it doesn't already exist.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='trial_ends_at') THEN
        ALTER TABLE profiles ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 2. Create `generation_logs` table to track AI usage
CREATE TABLE IF NOT EXISTS public.generation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security) on the new table
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for users to see only their own logs (optional but good practice)
-- CREATE POLICY "Users can insert their own generation logs" 
-- ON public.generation_logs FOR INSERT 
-- WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can view their own generation logs" 
-- ON public.generation_logs FOR SELECT 
-- USING (auth.uid() = user_id);

-- Allow authenticated users to insert their logs via Service Role (which bypasses RLS if used on the backend)
-- If using anon key from frontend, uncomment policies above. Since we do it in the Next.js API route,
-- it runs with the service_role key or user key. For safety, just allow insert for authenticated.
CREATE POLICY "Authenticated users can insert logs" ON public.generation_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can select own logs" ON public.generation_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 5. Update any existing users (if they have no trial limit yet)
-- Optionally give them a fresh 7 days from today: 
-- UPDATE profiles SET trial_ends_at = NOW() + INTERVAL '7 days' WHERE subscription_status = 'trial' AND trial_ends_at IS NULL;
