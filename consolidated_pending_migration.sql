-- =============================================================================
-- KIDSPIRE CONSOLIDATED SUPABASE SCHEMA MIGRATION SCRIPT
-- Run this script in Supabase Dashboard -> SQL Editor
-- 
-- Safe to execute against existing production/dev databases.
-- Uses IF NOT EXISTS, ON CONFLICT, and DROP/CREATE POLICY guards throughout.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CATEGORIES & SPORTS SUBCATEGORIES TABLE (PENDING - NEW)
-- Creates hierarchical categories (Sports -> Football, Basketball, etc.) & Standalone categories
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    icon_emoji TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories" 
    ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super admins can manage categories" ON public.categories;
CREATE POLICY "Super admins can manage categories" 
    ON public.categories FOR ALL USING (
        EXISTS (SELECT 1 FROM public.super_admins sa WHERE sa.auth_user_id = auth.uid())
    );

-- Seed Top-Level Parent Category Hubs (Sports & Talents)
INSERT INTO public.categories (id, name, slug, parent_id, display_order, icon_emoji, photo_url)
VALUES 
    ('cat-sports', 'Sports', 'sports', NULL, 1, '⚽', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop&q=60'),
    ('cat-talents', 'Talents & Hobbies', 'talents', NULL, 2, '🎨', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon_emoji = EXCLUDED.icon_emoji,
    photo_url = EXCLUDED.photo_url;

-- Seed Sports Subcategories (parent_id = 'cat-sports')
INSERT INTO public.categories (id, name, slug, parent_id, display_order, icon_emoji, photo_url)
VALUES 
    ('subcat-football', 'Football', 'football', 'cat-sports', 1, '⚽', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=60'),
    ('subcat-basketball', 'Basketball', 'basketball', 'cat-sports', 2, '🏀', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=60'),
    ('subcat-cricket', 'Cricket', 'cricket', 'cat-sports', 3, '🏏', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60'),
    ('subcat-swimming', 'Swimming', 'swimming', 'cat-sports', 4, '🏊', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=60'),
    ('subcat-skating', 'Skating', 'skating', 'cat-sports', 5, '🛼', 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&auto=format&fit=crop&q=60'),
    ('subcat-cycling', 'Cycling', 'cycling', 'cat-sports', 6, '🚴', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    parent_id = EXCLUDED.parent_id,
    photo_url = EXCLUDED.photo_url;

-- Seed Talents & Hobbies Subcategories (parent_id = 'cat-talents')
INSERT INTO public.categories (id, name, slug, parent_id, display_order, icon_emoji, photo_url)
VALUES 
    ('subcat-music', 'Music', 'music', 'cat-talents', 1, '🎵', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60'),
    ('subcat-martial-arts', 'Martial Arts', 'martial-arts', 'cat-talents', 2, '🥋', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=60'),
    ('subcat-yoga', 'Yoga & Fitness', 'yoga', 'cat-talents', 3, '🧘', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60'),
    ('subcat-arts', 'Art & Crafts', 'arts', 'cat-talents', 4, '🎨', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60'),
    ('subcat-drama', 'Drama & Theater', 'drama', 'cat-talents', 5, '🎭', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60'),
    ('subcat-cooking', 'Cooking & Baking', 'cooking', 'cat-talents', 6, '🍳', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=60'),
    ('subcat-stem', 'STEM & Robotics', 'stem', 'cat-talents', 7, '🤖', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60'),
    ('subcat-dance', 'Dance', 'dance', 'cat-talents', 8, '💃', 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=60'),
    ('subcat-chess', 'Chess', 'chess', 'cat-talents', 9, '♟️', 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=60'),
    ('subcat-speaking', 'Public Speaking', 'speaking', 'cat-talents', 10, '🎤', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=60')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    parent_id = EXCLUDED.parent_id,
    photo_url = EXCLUDED.photo_url;


-- -----------------------------------------------------------------------------
-- 2. SEATING TIERS & BOOKING COLUMNS (ALREADY APPLIED LIVE, SAFELY INCLUDED)
-- Creates event_seating_tiers table and adds tier_id/tier_name to bookings
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.event_seating_tiers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    tier_name TEXT NOT NULL,
    tier_price NUMERIC(10, 2) NOT NULL,
    tier_seats_total INTEGER NOT NULL,
    tier_seats_available INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tier_id TEXT REFERENCES public.event_seating_tiers(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tier_name TEXT;

-- RLS for event_seating_tiers
ALTER TABLE public.event_seating_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to seating tiers for approved events" ON public.event_seating_tiers;
CREATE POLICY "Allow public read access to seating tiers for approved events" ON public.event_seating_tiers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = public.event_seating_tiers.event_id AND e.status = 'approved'
        )
    );

DROP POLICY IF EXISTS "Organization admins can manage own event seating tiers" ON public.event_seating_tiers;
CREATE POLICY "Organization admins can manage own event seating tiers" ON public.event_seating_tiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND e.id = public.event_seating_tiers.event_id
        )
    );

DROP POLICY IF EXISTS "Super admins can manage all seating tiers" ON public.event_seating_tiers;
CREATE POLICY "Super admins can manage all seating tiers" ON public.event_seating_tiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins sa
            WHERE sa.auth_user_id = auth.uid()
        )
    );


-- -----------------------------------------------------------------------------
-- 3. EVENTS EXTENDED FIELDS (ALREADY APPLIED LIVE, SAFELY INCLUDED)
-- Adds 4 listing format types & sponsored metadata columns to public.events
-- -----------------------------------------------------------------------------

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'event' CHECK (listing_type IN ('event', 'competition', 'course', 'webinar'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS prize_details TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS eligibility_rules TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS session_count INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS session_frequency TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS course_duration_weeks INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS curriculum_outline TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS join_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS sponsor_tier TEXT CHECK (sponsor_tier IN ('featured', 'premium', 'standard'));


-- -----------------------------------------------------------------------------
-- 4. AUTH CONSTRAINTS & AUTO-PROFILE TRIGGER (SAFETY HARMONIZATION)
-- Ensures auth_user_id keys have UNIQUE indexes for ON CONFLICT upserting
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
    INSERT INTO public.parents (id, auth_user_id, name, email, phone)
    VALUES (gen_random_uuid()::text, NEW.id, user_name, NEW.email, '')
    ON CONFLICT (auth_user_id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;

  ELSIF user_role = 'admin' THEN
    INSERT INTO public.organization_admins (id, auth_user_id, name, role)
    VALUES (gen_random_uuid()::text, NEW.id, user_name, 'admin')
    ON CONFLICT (auth_user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verification output
SELECT 'Migration finished successfully!' AS status;
