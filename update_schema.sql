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
