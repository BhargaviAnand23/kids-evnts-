-- =============================================================================
-- KIDSPIRE PLATFORM - PAYOUTS TABLE & RLS POLICIES MIGRATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.payouts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid')),
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organization admins can view own payouts" ON public.payouts;
CREATE POLICY "Organization admins can view own payouts" ON public.payouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_admins oa
            WHERE oa.auth_user_id = auth.uid() AND oa.organization_id = public.payouts.organization_id
        )
    );

DROP POLICY IF EXISTS "Super admins can manage all payouts" ON public.payouts;
CREATE POLICY "Super admins can manage all payouts" ON public.payouts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins sa
            WHERE sa.auth_user_id = auth.uid()
        )
    );
