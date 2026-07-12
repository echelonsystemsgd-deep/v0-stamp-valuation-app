-- Migration: Add Shopify Modules (Payout Bonuses & Marketing campaigns)

-- 1. Create payout_bonus_codes table
CREATE TABLE IF NOT EXISTS public.payout_bonus_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    percentage_bonus NUMERIC(5, 2) NOT NULL, -- e.g. 10.00 for 10%
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Link submissions to payout_bonus_codes
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS applied_bonus_code_id UUID REFERENCES public.payout_bonus_codes(id) ON DELETE SET NULL;

-- 3. Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    target_group TEXT NOT NULL, -- e.g. 'all_sellers', 'inactive_sellers'
    sent_count INTEGER DEFAULT 0 NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.payout_bonus_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies using get_user_role function
-- Payout Bonus Codes: Admins can do all; authenticated view active
CREATE POLICY "Admins can manage payout_bonus_codes" ON public.payout_bonus_codes
    FOR ALL TO authenticated USING (
        public.get_user_role(auth.uid()) = 'admin'::public.user_role
    );

CREATE POLICY "Authenticated users can select active payout_bonus_codes" ON public.payout_bonus_codes
    FOR SELECT TO authenticated USING (is_active = TRUE);

-- Marketing Campaigns: Admins and staff can manage
CREATE POLICY "Admins and staff can manage marketing_campaigns" ON public.marketing_campaigns
    FOR ALL TO authenticated USING (
        public.get_user_role(auth.uid()) IN ('admin'::public.user_role, 'staff'::public.user_role)
    );
