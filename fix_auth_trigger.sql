-- =============================================================================
-- FIX: Complete Supabase Auth & Profile Setup
-- Run this ENTIRE script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Add UNIQUE Constraints on auth_user_id to support ON CONFLICT
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'parents_auth_user_id_key' AND table_name = 'parents'
    ) THEN
        ALTER TABLE public.parents ADD CONSTRAINT parents_auth_user_id_key UNIQUE (auth_user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'organization_admins_auth_user_id_key' AND table_name = 'organization_admins'
    ) THEN
        ALTER TABLE public.organization_admins ADD CONSTRAINT organization_admins_auth_user_id_key UNIQUE (auth_user_id);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- STEP 2: Enable RLS and Permissive Policies on `parents` and `organization_admins`
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.parents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert for signup" ON public.parents;
CREATE POLICY "Allow public insert for signup"
  ON public.parents FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select parents" ON public.parents;
CREATE POLICY "Allow select parents"
  ON public.parents FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update parents" ON public.parents;
CREATE POLICY "Allow update parents"
  ON public.parents FOR UPDATE
  USING (true);

ALTER TABLE IF EXISTS public.organization_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert org_admins" ON public.organization_admins;
CREATE POLICY "Allow public insert org_admins"
  ON public.organization_admins FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select org_admins" ON public.organization_admins;
CREATE POLICY "Allow select org_admins"
  ON public.organization_admins FOR SELECT
  USING (true);

-- -----------------------------------------------------------------------------
-- STEP 3: Database Trigger for automatic server-side profile creation
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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
    ON CONFLICT (auth_user_id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;

  ELSIF user_role = 'admin' THEN
    INSERT INTO public.organization_admins (auth_user_id, name, role)
    VALUES (NEW.id, user_name, 'admin')
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- STEP 4: Retroactively create missing profile records for any existing auth users
-- -----------------------------------------------------------------------------
INSERT INTO public.parents (auth_user_id, name, email, phone)
SELECT 
  id, 
  COALESCE(raw_user_meta_data ->> 'name', split_part(email, '@', 1)), 
  email, 
  ''
FROM auth.users
WHERE id NOT IN (SELECT auth_user_id FROM public.parents WHERE auth_user_id IS NOT NULL)
  AND (raw_user_meta_data ->> 'role' IS NULL OR raw_user_meta_data ->> 'role' = 'parent')
ON CONFLICT (auth_user_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- STEP 5: Verify Trigger & Stored Parent Profiles
-- -----------------------------------------------------------------------------
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';


