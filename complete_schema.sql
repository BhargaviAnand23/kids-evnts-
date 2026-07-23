-- =============================================================================
-- KIDSPIRE PLATFORM - COMPLETE CONSOLIDATED SUPABASE SCHEMA MIGRATION
-- Run this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- This script is fully idempotent and aligns with the live production DB where 
-- table primary keys (id) are TEXT strings (e.g. 'parent-seed-1', 'evt-1', 'org-1').
-- =============================================================================

-- Enable pgcrypto & uuid extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('school', 'college', 'club', 'sports_academy', 'arts_studio', 'camp', 'independent', 'other')),
    logo_url TEXT,
    contact_email TEXT NOT NULL,
    address TEXT,
    verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PARENTS
CREATE TABLE IF NOT EXISTS public.parents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORGANIZATION ADMINS
CREATE TABLE IF NOT EXISTS public.organization_admins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    organization_id TEXT REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.5 SUPER ADMINS
CREATE TABLE IF NOT EXISTS public.super_admins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CHILDREN
CREATE TABLE IF NOT EXISTS public.children (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    school_id TEXT REFERENCES public.schools(id) ON DELETE SET NULL,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organizer_id TEXT REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    age_bracket TEXT NOT NULL CHECK (age_bracket IN ('early_kids', 'kids', 'teens', 'young_adults')),
    event_date DATE NOT NULL,
    event_time TIME WITHOUT TIME ZONE NOT NULL,
    location TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    seats_total INTEGER NOT NULL,
    seats_available INTEGER NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'pending_review' NOT NULL CHECK (status IN ('pending_review', 'approved', 'rejected')),
    rejection_reason TEXT,
    is_sponsored BOOLEAN DEFAULT false NOT NULL,
    sponsor_tier TEXT CHECK (sponsor_tier IN ('featured', 'premium', 'standard')),
    
    -- Listing types: event, competition, course, webinar
    listing_type TEXT DEFAULT 'event' CHECK (listing_type IN ('event', 'competition', 'course', 'webinar')),
    
    -- Type-specific fields
    registration_deadline TIMESTAMP WITH TIME ZONE,
    prize_details TEXT,
    eligibility_rules TEXT,
    session_count INTEGER,
    session_frequency TEXT,
    course_duration_weeks INTEGER,
    curriculum_outline TEXT,
    is_online BOOLEAN DEFAULT false NOT NULL,
    join_link TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all new columns exist on existing events table (Idempotent upgrades)
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
ALTER TABLE public.events ALTER COLUMN location DROP NOT NULL;

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'confirmed' NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    payment_status TEXT DEFAULT 'paid' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    booking_reference TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SAVED EVENTS (Wishlist)
CREATE TABLE IF NOT EXISTS public.saved_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(parent_id, event_id)
);

-- 9. WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- =============================================================================

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Schools
DROP POLICY IF EXISTS "Allow public read access to schools" ON public.schools;
CREATE POLICY "Allow public read access to schools" ON public.schools FOR SELECT USING (true);

-- Organizations
DROP POLICY IF EXISTS "Allow public read access to organizations" ON public.organizations;
CREATE POLICY "Allow public read access to organizations" ON public.organizations FOR SELECT USING (true);

-- Events
DROP POLICY IF EXISTS "Allow public read access to approved events" ON public.events;
CREATE POLICY "Allow public read access to approved events" ON public.events FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Organization admins can manage own events" ON public.events;
CREATE POLICY "Organization admins can manage own events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_admins oa
            WHERE oa.auth_user_id = auth.uid() AND oa.organization_id = public.events.organizer_id
        )
    );

DROP POLICY IF EXISTS "Super admins can manage all events" ON public.events;
CREATE POLICY "Super admins can manage all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins sa
            WHERE sa.auth_user_id = auth.uid()
        )
    );

-- Parents & Children
DROP POLICY IF EXISTS "Parents can view own profile" ON public.parents;
CREATE POLICY "Parents can view own profile" ON public.parents FOR SELECT USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Parents can update own profile" ON public.parents;
CREATE POLICY "Parents can update own profile" ON public.parents FOR UPDATE USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Parents can view own children" ON public.children;
CREATE POLICY "Parents can view own children" ON public.children FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.children.parent_id)
);

DROP POLICY IF EXISTS "Parents can manage own children" ON public.children;
CREATE POLICY "Parents can manage own children" ON public.children FOR ALL USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.children.parent_id)
);

-- Bookings
DROP POLICY IF EXISTS "Parents can view own bookings" ON public.bookings;
CREATE POLICY "Parents can view own bookings" ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.bookings.parent_id)
);

DROP POLICY IF EXISTS "Parents can insert bookings" ON public.bookings;
CREATE POLICY "Parents can insert bookings" ON public.bookings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.bookings.parent_id)
);

DROP POLICY IF EXISTS "Organization admins can view event bookings" ON public.bookings;
CREATE POLICY "Organization admins can view event bookings" ON public.bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
        WHERE oa.auth_user_id = auth.uid() AND e.id = public.bookings.event_id
    )
);

-- Saved Events
DROP POLICY IF EXISTS "Parents can view own saved events" ON public.saved_events;
CREATE POLICY "Parents can view own saved events" ON public.saved_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id)
);

DROP POLICY IF EXISTS "Parents can save events" ON public.saved_events;
CREATE POLICY "Parents can save events" ON public.saved_events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id)
);

DROP POLICY IF EXISTS "Parents can unsave events" ON public.saved_events;
CREATE POLICY "Parents can unsave events" ON public.saved_events FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id)
);

-- Waitlist
DROP POLICY IF EXISTS "Parents can view own waitlist" ON public.waitlist;
CREATE POLICY "Parents can view own waitlist" ON public.waitlist FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id)
);

DROP POLICY IF EXISTS "Parents can join waitlist" ON public.waitlist;
CREATE POLICY "Parents can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id)
);

DROP POLICY IF EXISTS "Parents can leave waitlist" ON public.waitlist;
CREATE POLICY "Parents can leave waitlist" ON public.waitlist FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id)
);

-- Notifications
DROP POLICY IF EXISTS "Parents can view own notifications" ON public.notifications;
CREATE POLICY "Parents can view own notifications" ON public.notifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.notifications.parent_id)
);

-- Reviews
DROP POLICY IF EXISTS "Allow public read access to reviews" ON public.reviews;
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Parents can insert own reviews" ON public.reviews;
CREATE POLICY "Parents can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = parent_id)
);

-- =============================================================================
-- AUTH TRIGGER: Auto-create parent or organization admin profile on signup
-- =============================================================================

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
    ON CONFLICT (auth_user_id) DO NOTHING;

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
