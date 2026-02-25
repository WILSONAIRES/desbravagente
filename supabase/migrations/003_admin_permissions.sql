-- Migration: Allow admin to update any profile (Idempotent Version)
-- This fixes the "Erro ao atualizar usuário" by ensuring the policy exists and is correct.

-- 1. First, remove the policy if it already exists to avoid conflict
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Create the policy with correct admin logic
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR email = 'waisilva@gmail.com')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR email = 'waisilva@gmail.com')
  )
);
