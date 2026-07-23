-- =============================================================================
-- FIX: Auto-create parent/admin profile on Supabase Auth user creation
-- Run this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =============================================================================

-- STEP 1: Drop existing trigger/function if present (safe to re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- STEP 2: Create the trigger function
-- Reads role and name from the user's raw_user_meta_data (set during signUp)
-- Runs as SECURITY DEFINER = server-side privilege, bypasses RLS entirely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  user_role := NEW.raw_user_meta_data ->> 'role';
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1));

  IF user_role IS NULL OR user_role = 'parent' THEN
    INSERT INTO public.parents (auth_user_id, name, email, phone)
    VALUES (NEW.id, user_name, NEW.email, '')
    ON CONFLICT (auth_user_id) DO NOTHING;

  ELSIF user_role = 'admin' THEN
    INSERT INTO public.organization_admins (auth_user_id, name, role)
    VALUES (NEW.id, user_name, 'admin')
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- STEP 3: Attach the trigger to fire AFTER every new auth user is inserted
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- STEP 4: FIX STUCK ACCOUNT - bhargavianandhan@gmail.com
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Find bhargavianandhan@gmail.com and copy their UUID
-- 3. Replace PASTE-UUID-HERE below with that UUID, then run this block
-- =============================================================================

INSERT INTO public.parents (auth_user_id, name, email, phone)
VALUES (
  'PASTE-UUID-HERE'::uuid,
  'Bhargavi Anandhan',
  'bhargavianandhan@gmail.com',
  ''
)
ON CONFLICT (auth_user_id) DO NOTHING;

-- =============================================================================
-- STEP 5: VERIFY
-- =============================================================================
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

SELECT id, auth_user_id, name, email, created_at
FROM public.parents
WHERE email = 'bhargavianandhan@gmail.com';
