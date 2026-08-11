-- Migration SQL for adding event_media table and RLS policies

CREATE TABLE IF NOT EXISTS public.event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    uploaded_by UUID REFERENCES public.organization_admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_event_media_event_id ON public.event_media(event_id);
CREATE INDEX IF NOT EXISTS idx_event_media_display_order ON public.event_media(event_id, display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view media for approved events
CREATE POLICY "Anyone can view media for approved events" ON public.event_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = public.event_media.event_id AND e.status = 'approved'
        )
    );

-- Policy 2: Organization admins can manage media for their own organization's events
CREATE POLICY "Organization admins can manage media for their events" ON public.event_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organization_admins oa ON e.organizer_id = oa.organization_id
            WHERE e.id = public.event_media.event_id AND oa.auth_user_id = auth.uid()
        )
    );

-- Policy 3: Super admins can manage all media
CREATE POLICY "Super admins can manage all media" ON public.event_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins sa
            WHERE sa.auth_user_id = auth.uid()
        )
    );
