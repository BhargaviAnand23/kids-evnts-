-- Create database schema for Kidspire Youth Event Booking Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS (Tracks children's own school separately from event hosting)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORGANIZATIONS (Event hosts)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORGANIZATION ADMINS
CREATE TABLE IF NOT EXISTS public.organization_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.5 SUPER ADMINS
CREATE TABLE IF NOT EXISTS public.super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CHILDREN
CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g. 'Sports', 'Arts & Crafts', 'STEM & Tech', etc.
    age_bracket TEXT NOT NULL CHECK (age_bracket IN ('early_kids', 'kids', 'teens', 'young_adults')),
    event_date DATE NOT NULL,
    event_time TIME WITHOUT TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    seats_total INTEGER NOT NULL,
    seats_available INTEGER NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'pending_review' NOT NULL CHECK (status IN ('pending_review', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'confirmed' NOT NULL, -- 'pending', 'confirmed', 'cancelled'
    payment_status TEXT DEFAULT 'paid' NOT NULL, -- 'pending', 'paid', 'refunded'
    booking_reference TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Schools: Public read; Admins write
CREATE POLICY "Allow public read access to schools" ON public.schools
    FOR SELECT USING (true);
CREATE POLICY "Allow organization admin CRUD on schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_admins oa 
            WHERE oa.auth_user_id = auth.uid()
        )
    );

-- Organizations: Public read; Admins write
CREATE POLICY "Allow public read access to organizations" ON public.organizations
    FOR SELECT USING (true);
CREATE POLICY "Allow organization admin CRUD on organizations" ON public.organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_admins oa 
            WHERE oa.auth_user_id = auth.uid() AND oa.organization_id = public.organizations.id
        )
    );

-- Parents: Read/write own profile; Admins view if parent booked their events
CREATE POLICY "Parents can read own profile" ON public.parents
    FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Parents can insert own profile" ON public.parents
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Parents can update own profile" ON public.parents
    FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Organization admins can read parent details for bookings" ON public.parents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.events e ON b.event_id = e.id
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND b.parent_id = public.parents.id
        )
    );

-- Organization Admins: Read/write own profile
CREATE POLICY "Organization admins can read own profile" ON public.organization_admins
    FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Organization admins can insert own profile" ON public.organization_admins
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Organization admins can update own profile" ON public.organization_admins
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Super Admins: Read/write own profile
CREATE POLICY "Super admins can read own profile" ON public.super_admins
    FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Super admins can insert own profile" ON public.super_admins
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Super admins can update own profile" ON public.super_admins
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Children: Parents manage; Admins view if child is booked
CREATE POLICY "Parents can manage own children" ON public.children
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.parents p 
            WHERE p.auth_user_id = auth.uid() AND p.id = public.children.parent_id
        )
    );
CREATE POLICY "Organization admins can view children booked for their events" ON public.children
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.events e ON b.event_id = e.id
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND b.child_id = public.children.id
        )
    );

-- Events: Public can view approved; Admins manage own organization's events; Super Admins manage all
CREATE POLICY "Anyone can view approved events" ON public.events
    FOR SELECT USING (status = 'approved');
CREATE POLICY "Organization admins can manage events for their organization" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_admins oa
            WHERE oa.auth_user_id = auth.uid() AND oa.organization_id = public.events.organizer_id
        )
    );
CREATE POLICY "Super admins can manage all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins sa
            WHERE sa.auth_user_id = auth.uid()
        )
    );

-- Bookings: Parents manage own; Admins view/update their organization's bookings
CREATE POLICY "Parents can select own bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.bookings.parent_id
        )
    );
CREATE POLICY "Parents can insert own bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.bookings.parent_id
        )
    );
CREATE POLICY "Parents can update own bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.bookings.parent_id
        )
    );
CREATE POLICY "Organization admins can read bookings for their events" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND e.id = public.bookings.event_id
        )
    );
CREATE POLICY "Organization admins can update bookings for their events" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND e.id = public.bookings.event_id
        )
    );

-- Trigger to automatically decrement seats_available when a booking is created
CREATE OR REPLACE FUNCTION public.decrement_seats_on_booking()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.events
    SET seats_available = seats_available - 1
    WHERE id = NEW.event_id AND seats_available > 0;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No seats available for this event';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_decrement_seats
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.decrement_seats_on_booking();

-- Seed Data (Schools)
INSERT INTO public.schools (id, name, address, contact_email) VALUES
('school-greenwood-elem', 'Greenwood Elementary School', '123 Pine St, Seattle, WA', 'info@greenwood.edu'),
('school-riverside-acad', 'Riverside Academy', '456 River Rd, Portland, OR', 'contact@riverside.edu')
ON CONFLICT (id) DO NOTHING;

-- Seed Data (Organizations)
INSERT INTO public.organizations (id, name, type, logo_url, contact_email, address, verified) VALUES
('org-greenwood-elem', 'Greenwood Elementary School', 'school', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=60', 'info@greenwood.edu', '123 Pine St, Seattle, WA', true),
('org-riverside-prep', 'Riverside College Prep', 'college', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=60', 'contact@riverside.edu', '456 River Rd, Portland, OR', true),
('org-youth-soccer', 'Metropolitan Youth Sports Club', 'club', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=100&auto=format&fit=crop&q=60', 'coach@metroyouth.org', '789 Stadium Way, Seattle, WA', true),
('org-stem-labs', 'Independent STEM Labs', 'independent', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60', 'hello@stemlabs.io', 'Art & Tech Center Room 303', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Data (Events)
INSERT INTO public.events (id, organizer_id, title, description, category, age_bracket, event_date, event_time, location, price, seats_total, seats_available, image_url, status) VALUES
('b2a1a8c9-9488-4903-883c-1b7713d719e7', 'org-stem-labs', 'Science Experiment Day', 'Hands-on physics and chemistry experiments for kids. Build a mini volcano, make slime, and launch model rockets!', 'STEM & Tech', 'kids', '2026-08-15', '10:00:00', 'Main Science Lab', 15.00, 30, 25, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60', 'approved'),
('e3b4d5c6-9488-4903-883c-1b7713d719e8', 'org-youth-soccer', 'Kids Soccer Camp', 'Friendly introductory soccer session covering dribbling, passing, and basic team play. All experience levels welcome.', 'Sports', 'early_kids', '2026-08-20', '09:00:00', 'Greenwood Playing Field', 10.00, 20, 18, 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=60', 'approved'),
('d5a6b7c8-9488-4903-883c-1b7713d719e9', 'org-riverside-prep', 'Kids Clay Modeling & Painting', 'Let your child express their creativity! In this guided session, kids will design clay structures and paint them.', 'Arts & Crafts', 'early_kids', '2026-08-22', '14:00:00', 'Art Studio Room A', 20.00, 15, 15, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60', 'approved'),
('c7d8e9f0-9488-4903-883c-1b7713d719fa', 'org-greenwood-elem', 'Introduction to Coding with Scratch', 'Learn coding basics by building fun interactive games with Scratch block coding. Ideal for complete beginners.', 'STEM & Tech', 'kids', '2026-08-25', '11:00:00', 'Computer Lab 3', 0.00, 25, 25, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60', 'approved')
ON CONFLICT (id) DO NOTHING;

-- 8. SAVED EVENTS (Wishlist)
CREATE TABLE IF NOT EXISTS public.saved_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(parent_id, event_id)
);

-- 9. WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for new tables
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for saved_events
CREATE POLICY "Parents can view own saved events" ON public.saved_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id
        )
    );

CREATE POLICY "Parents can save events" ON public.saved_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id
        )
    );

CREATE POLICY "Parents can unsave events" ON public.saved_events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.saved_events.parent_id
        )
    );

-- Policies for waitlist
CREATE POLICY "Parents can view own waitlist entries" ON public.waitlist
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id
        )
    );

CREATE POLICY "Parents can join waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id
        )
    );

CREATE POLICY "Parents can leave waitlist" ON public.waitlist
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.waitlist.parent_id
        )
    );

CREATE POLICY "Organization admins can read waitlist for their events" ON public.waitlist
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE oa.auth_user_id = auth.uid() AND e.id = public.waitlist.event_id
        )
    );

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' NOT NULL, -- 'success', 'alert', 'info'
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Parents can view own notifications" ON public.notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.notifications.parent_id
        )
    );

CREATE POLICY "Parents can delete own notifications" ON public.notifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.auth_user_id = auth.uid() AND p.id = public.notifications.parent_id
        )
    );

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- 11. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Parents can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.parents p
        WHERE p.auth_user_id = auth.uid() AND p.id = parent_id
    )
);
