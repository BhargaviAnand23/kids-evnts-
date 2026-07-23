-- Migration Script: Support Four Listing Types (Events, Competitions, Courses, Webinars)
-- Run this script in the Supabase Dashboard -> SQL Editor

-- 1. Add listing_type column with CHECK constraint (matching other enum columns in the schema)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS listing_type TEXT NOT NULL DEFAULT 'event' 
CHECK (listing_type IN ('event', 'competition', 'course', 'webinar'));

-- 2. Add competition columns (nullable)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS prize_details TEXT,
ADD COLUMN IF NOT EXISTS eligibility_rules TEXT;

-- 3. Add course columns (nullable)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS session_count INTEGER,
ADD COLUMN IF NOT EXISTS session_frequency TEXT,
ADD COLUMN IF NOT EXISTS course_duration_weeks INTEGER,
ADD COLUMN IF NOT EXISTS curriculum_outline TEXT;

-- 4. Add webinar columns (nullable)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS is_online BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS join_link TEXT;

-- 5. Remove NOT NULL requirement for physical location to support online webinars
ALTER TABLE public.events 
ALTER COLUMN location DROP NOT NULL;
