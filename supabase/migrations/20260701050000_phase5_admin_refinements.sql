-- Phase 5 Admin Refinements Migration

-- 1. Create submission_internal_notes table
CREATE TABLE IF NOT EXISTS public.submission_internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Enable RLS on notes table
ALTER TABLE public.submission_internal_notes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for submission_internal_notes (restricted to admin & staff only)
CREATE POLICY "Admins and staff can select internal notes" ON public.submission_internal_notes
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
        )
    );

CREATE POLICY "Admins and staff can insert internal notes" ON public.submission_internal_notes
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
        )
    );

-- 4. Drop existing admin-only policies that need staff extensions
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can manage items" ON public.submission_items;
DROP POLICY IF EXISTS "Admins can manage images" ON public.submission_images;
DROP POLICY IF EXISTS "Admins have full access to payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins view history" ON public.submission_history;
DROP POLICY IF EXISTS "Admins view audits" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Admins view logins" ON public.user_login_history;
DROP POLICY IF EXISTS "Categories managed by admins" ON public.stamp_categories;
DROP POLICY IF EXISTS "Admins view category history" ON public.stamp_category_history;
DROP POLICY IF EXISTS "Admins can manage all payout details" ON public.profile_payout_details;

-- 5. Create extended RLS policies for both Admins and Staff
CREATE POLICY "Admins can manage profiles" ON public.profiles
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Staff can view profiles" ON public.profiles
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'staff')
    );

CREATE POLICY "Admins and staff can manage submissions" ON public.submissions
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can manage items" ON public.submission_items
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can manage images" ON public.submission_images
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can manage payouts" ON public.payouts
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can view history" ON public.submission_history
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can insert history" ON public.submission_history
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can view audits" ON public.admin_audit_logs
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can view logins" ON public.user_login_history
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins and staff can view category history" ON public.stamp_category_history
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Admins can manage all payout details" ON public.profile_payout_details
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Staff can view all payout details" ON public.profile_payout_details
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'staff')
    );

-- 6. Stamp categories policies: Public readable, Admins manage (write)
CREATE POLICY "Admins can manage stamp categories" ON public.stamp_categories
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. Chat messages (submission_messages) policies update
DROP POLICY IF EXISTS "Sellers can view own submission messages" ON public.submission_messages;
DROP POLICY IF EXISTS "Sellers can insert own submission messages" ON public.submission_messages;

CREATE POLICY "Sellers, admins and staff can view submission messages" ON public.submission_messages
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.submissions s 
            WHERE s.id = submission_messages.submission_id 
            AND (s.user_id = auth.uid() OR s.guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
        )
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );

CREATE POLICY "Sellers, admins and staff can insert submission messages" ON public.submission_messages
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.submissions s 
            WHERE s.id = submission_messages.submission_id 
            AND s.user_id = auth.uid()
        )
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff'))
    );
