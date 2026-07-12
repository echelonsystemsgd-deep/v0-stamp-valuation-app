-- Migration: Add assigned_appraiser_id column and update RLS policies

-- 1. Add column to public.submissions
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS assigned_appraiser_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Drop existing update policies if any
DROP POLICY IF EXISTS "Admins and staff can manage submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins and staff can manage items" ON public.submission_items;

-- 3. Create updated policies for submissions:
-- Admin can manage all. Staff can manage if assigned_appraiser_id matches their ID, or is null.
CREATE POLICY "Admins and staff can manage submissions" ON public.submissions
    FOR ALL TO authenticated USING (
        public.get_user_role(auth.uid()) = 'admin'::public.user_role
        OR (
            public.get_user_role(auth.uid()) = 'staff'::public.user_role
            AND (assigned_appraiser_id IS NULL OR assigned_appraiser_id = auth.uid())
        )
    );

-- 4. Create updated policies for submission_items:
-- Staff can edit items if their submissions' assigned_appraiser_id matches their ID, or is null.
CREATE POLICY "Admins and staff can manage items" ON public.submission_items
    FOR ALL TO authenticated USING (
        public.get_user_role(auth.uid()) = 'admin'::public.user_role
        OR (
            public.get_user_role(auth.uid()) = 'staff'::public.user_role
            AND EXISTS (
                SELECT 1 FROM public.submissions s 
                WHERE s.id = submission_items.submission_id 
                AND (s.assigned_appraiser_id IS NULL OR s.assigned_appraiser_id = auth.uid())
            )
        )
    );
