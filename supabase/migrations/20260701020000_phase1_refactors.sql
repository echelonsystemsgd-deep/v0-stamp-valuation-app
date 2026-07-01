-- 1. PROFILE PAYOUT DETAILS SEPARATION
ALTER TABLE public.profiles DROP COLUMN IF EXISTS payout_details;

CREATE TABLE public.profile_payout_details (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    payout_method public.payout_method_type DEFAULT 'bank_transfer'::public.payout_method_type NOT NULL,
    bank_account_name TEXT,
    bank_account_number TEXT,
    bank_sort_code TEXT,
    cheque_recipient_name TEXT,
    cheque_address_line1 TEXT,
    cheque_address_line2 TEXT,
    cheque_city TEXT,
    cheque_postcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.profile_payout_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payout details" ON public.profile_payout_details FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own payout details" ON public.profile_payout_details FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own payout details" ON public.profile_payout_details FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all payout details" ON public.profile_payout_details TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. REFACTOR CATEGORY HISTORY
DROP TABLE IF EXISTS public.rate_changes_history;

CREATE TABLE public.stamp_category_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) NOT NULL,
    change_type TEXT NOT NULL, -- 'RATE_UPDATE', 'STATUS_CHANGE', 'METADATA_UPDATE'
    old_value JSONB DEFAULT '{}'::jsonb NOT NULL,
    new_value JSONB DEFAULT '{}'::jsonb NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.stamp_category_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view category history" ON public.stamp_category_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. SECURE SUBMISSION ITEMS & IMAGES RLS
DROP POLICY IF EXISTS "Enable insert for items" ON public.submission_items;
DROP POLICY IF EXISTS "Users can view own submission items" ON public.submission_items;
DROP POLICY IF EXISTS "Admins can manage items" ON public.submission_items;

DROP POLICY IF EXISTS "Enable insert for images" ON public.submission_images;
DROP POLICY IF EXISTS "Users can view own images" ON public.submission_images;
DROP POLICY IF EXISTS "Admins can manage images" ON public.submission_images;

-- Re-create submission_items policies
CREATE POLICY "Users can view own submission items" ON public.submission_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_items.submission_id 
          AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
);

CREATE POLICY "Users/Guests can insert submission items" ON public.submission_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_id 
          AND (user_id = auth.uid() OR user_id IS NULL)
    )
);

CREATE POLICY "Admins can manage items" ON public.submission_items TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Re-create submission_images policies
CREATE POLICY "Users can view own images" ON public.submission_images FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_images.submission_id 
          AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
);

CREATE POLICY "Users/Guests can insert submission images" ON public.submission_images FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_id 
          AND (user_id = auth.uid() OR user_id IS NULL)
    )
);

CREATE POLICY "Admins can manage images" ON public.submission_images TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. UPDATE UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_profile_payout_details_updated_at 
    BEFORE UPDATE ON public.profile_payout_details 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_stamp_categories_updated_at 
    BEFORE UPDATE ON public.stamp_categories 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_submissions_updated_at 
    BEFORE UPDATE ON public.submissions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_guest_email ON public.submissions(guest_email) WHERE guest_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stamp_categories_is_active ON public.stamp_categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stamp_categories_group_name ON public.stamp_categories(group_name);
CREATE INDEX IF NOT EXISTS idx_submission_items_submission_id ON public.submission_items(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_images_submission_id ON public.submission_images(submission_id);
CREATE INDEX IF NOT EXISTS idx_payouts_submission_id ON public.payouts(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_history_submission_id ON public.submission_history(submission_id);
CREATE INDEX IF NOT EXISTS idx_stamp_category_history_category_id ON public.stamp_category_history(category_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user ON public.admin_audit_logs(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON public.user_login_history(user_id);
