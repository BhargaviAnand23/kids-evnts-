-- =============================================================================
-- KIDSPIRE SCHEMA UPDATE MIGRATION SCRIPT FOR SUPABASE
-- Run this script in Supabase -> SQL Editor
-- =============================================================================

-- Ensure listing_type and type-specific fields exist on public.events
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

-- RLS
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Parents can view own notifications" ON public.notifications;
CREATE POLICY "Parents can view own notifications" ON public.notifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parents p WHERE p.auth_user_id = auth.uid() AND p.id = public.notifications.parent_id)
);

-- Age bracket migration for 3-18 range: early_years (3-5), kids (6-12), teens (13-18)
UPDATE public.events SET age_bracket = 'early_years' WHERE age_bracket = 'early_kids';
UPDATE public.events SET age_bracket = 'teens' WHERE age_bracket = 'young_adults';

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_age_bracket_check;
ALTER TABLE public.events ADD CONSTRAINT events_age_bracket_check CHECK (age_bracket IN ('early_years', 'kids', 'teens'));

-- 12. EVENT SEATING TIERS
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

-- RLS Policies for event_seating_tiers
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
