-- Create custom enums
CREATE TYPE public.user_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE public.account_status AS ENUM ('active', 'restricted', 'banned');
CREATE TYPE public.submission_status AS ENUM (
    'quote_requested', 'quote_given', 'awaiting_shipment', 
    'in_transit', 'received', 'under_review', 
    'approved', 'paid', 'rejected', 'cancelled'
);
CREATE TYPE public.payout_method_type AS ENUM ('bank_transfer', 'cheque');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    postcode TEXT,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    status public.account_status DEFAULT 'active'::public.account_status NOT NULL,
    ban_reason TEXT,
    payout_details JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create stamp_categories table
CREATE TABLE public.stamp_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    group_name TEXT NOT NULL,
    description TEXT,
    face_value NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(4, 3) NOT NULL,
    image_url TEXT,
    is_barcoded BOOLEAN DEFAULT TRUE NOT NULL,
    allow_decimal BOOLEAN DEFAULT FALSE NOT NULL,
    min_quantity NUMERIC(12, 2),
    max_quantity NUMERIC(12, 2),
    condition_requirements TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    paused_reason TEXT,
    paused_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    guest_postcode TEXT,
    collection_type TEXT NOT NULL,
    approx_quantity TEXT NOT NULL,
    estimated_era TEXT NOT NULL,
    description TEXT NOT NULL,
    valuable_items TEXT,
    estimated_valuation NUMERIC(12, 2) NOT NULL,
    final_reviewed_valuation NUMERIC(12, 2),
    status public.submission_status DEFAULT 'quote_requested'::public.submission_status NOT NULL,
    tracking_reference TEXT,
    date_received TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    rejection_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    cancellation_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create submission_items table
CREATE TABLE public.submission_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE SET NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    rate_at_submission NUMERIC(4, 3) NOT NULL,
    face_value_at_submission NUMERIC(10, 2) NOT NULL,
    calculated_value NUMERIC(12, 2) NOT NULL,
    reviewed_quantity NUMERIC(12, 2),
    reviewed_value NUMERIC(12, 2)
);

-- Create submission_images table
CREATE TABLE public.submission_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create payouts table
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    method public.payout_method_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    reference_number TEXT NOT NULL,
    issued_by UUID REFERENCES public.profiles(id) NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_details JSONB DEFAULT '{}'::jsonb NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Audit tables
CREATE TABLE public.rate_changes_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) NOT NULL,
    old_rate NUMERIC(4, 3) NOT NULL,
    new_rate NUMERIC(4, 3) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.submission_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    old_status public.submission_status NOT NULL,
    new_status public.submission_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) NOT NULL,
    action_type TEXT NOT NULL,
    target_user_id UUID REFERENCES public.profiles(id),
    details JSONB DEFAULT '{}'::jsonb,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.user_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_changes_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;

-- Triggers: handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        CASE 
            WHEN new.email = 'gslegacywealth@gmail.com' THEN 'admin'::public.user_role
            ELSE 'user'::public.user_role
        END,
        'active'::public.account_status
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-upgrade user to 'seller' on first submission
CREATE OR REPLACE FUNCTION public.handle_submission_inserted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE public.profiles
        SET role = 'seller'::public.user_role
        WHERE id = NEW.user_id AND role = 'user'::public.user_role;
    END IF;
    
    -- Insert initial status history
    INSERT INTO public.submission_history (submission_id, changed_by, old_status, new_status, notes)
    VALUES (NEW.id, NEW.user_id, 'quote_requested'::public.submission_status, 'quote_requested'::public.submission_status, 'Submission initial creation');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_inserted
    AFTER INSERT ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_submission_inserted();

-- Trigger: log status changes to submission_history
CREATE OR REPLACE FUNCTION public.log_submission_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.submission_history (submission_id, old_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_status_changed
    AFTER UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.log_submission_status_change();

-- RLS Policies
-- Profiles: Users see/edit their own, Admins see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Stamp Categories: Read by all, Managed by Admins
CREATE POLICY "Categories are public readable" ON public.stamp_categories FOR SELECT USING (true);
CREATE POLICY "Categories managed by admins" ON public.stamp_categories TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Submissions:
-- Guest users can insert submissions (anonymous/public insert policy)
CREATE POLICY "Enable insert for everyone" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers can view own submissions" ON public.submissions FOR SELECT USING (
    auth.uid() = user_id OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Sellers can update own submissions" ON public.submissions FOR UPDATE USING (
    auth.uid() = user_id
);
CREATE POLICY "Admins can manage all submissions" ON public.submissions TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Submission items & images:
CREATE POLICY "Users can view own submission items" ON public.submission_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_items.submission_id 
          AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
);
CREATE POLICY "Enable insert for items" ON public.submission_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage items" ON public.submission_items TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own images" ON public.submission_images FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions 
        WHERE id = submission_images.submission_id 
          AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
);
CREATE POLICY "Enable insert for images" ON public.submission_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage images" ON public.submission_images TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payouts, Audit Logs, and History: Admin-only SELECT/ALL, users can select own payouts
CREATE POLICY "Admins have full access to payouts" ON public.payouts TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sellers can view own payouts" ON public.payouts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.submissions WHERE id = payouts.submission_id AND user_id = auth.uid())
);

CREATE POLICY "Admins view history" ON public.submission_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sellers view own history" ON public.submission_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_history.submission_id AND user_id = auth.uid())
);

CREATE POLICY "Admins view rate history" ON public.rate_changes_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins view audits" ON public.admin_audit_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins view logins" ON public.user_login_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seeding categories
INSERT INTO public.stamp_categories (id, name, group_name, description, face_value, rate, is_barcoded, allow_decimal) VALUES
('1st-purple-complete-sheets-25-50', '1st Class Purple Sheets of 25/50', '1st Class', 'Full sheets of 25 or 50 barcoded purple 1st class stamps.', 1.80, 0.570, true, false),
('1st-purple-complete-booklets-4-8', '1st Class Purple Books of 4/8', '1st Class', 'Complete booklets of 4 or 8 barcoded purple 1st class stamps.', 1.80, 0.570, true, false),
('1st-purple-incomplete-sheets-booklets', '1st Class Purple Part Sheets and Booklets', '1st Class', 'Part sheets, incomplete booklets, or loose barcoded purple 1st class.', 1.80, 0.550, true, false),
('1st-xmas-complete-sheets-booklets', '1st Class Xmas QR Code', '1st Class', 'Complete Christmas / festive barcoded sheets and booklets.', 1.80, 0.480, true, false),
('1st-xmas-incomplete-sheets-booklets', '1st Class Incomplete Xmas QR', '1st Class', 'Incomplete festive sheets, booklets, or loose barcoded XMAS stamps.', 1.80, 0.450, true, false),
('ll-1st-turquoise-complete-sheets-25-50', '1st Large Sheet of 25 and 50', '1st Class Large', 'Full sheets of 25 or 50 barcoded turquoise large letter 1st class.', 3.30, 0.550, true, false),
('ll-1st-turquoise-complete-booklets-4', '1st Large Books of 4', '1st Class Large', 'Complete booklets of 4 barcoded turquoise large letter 1st class.', 3.30, 0.550, true, false),
('ll-1st-turquoise-incomplete-sheets-booklets', '1st Large Incomplete Sheets', '1st Class Large', 'Incomplete turquoise large letter sheets, booklets, or loose stamps.', 3.30, 0.530, true, false),
('2nd-green-complete-sheets-25-50', '2nd Class Sheets', '2nd Class', 'Full sheets of 25 or 50 barcoded green 2nd class stamps.', 0.91, 0.780, true, false),
('2nd-green-complete-booklets-8', '2nd Class Books of 8', '2nd Class', 'Complete booklets of 8 barcoded green 2nd class stamps.', 0.91, 0.780, true, false),
('2nd-green-incomplete-sheets-booklets', '2nd Class Incomplete', '2nd Class', 'Part sheets, incomplete booklets, or loose barcoded green 2nd class.', 0.91, 0.730, true, false),
('2nd-xmas-complete-sheets-booklets', '2nd Class Xmas QR', '2nd Class', 'Complete Christmas / festive barcoded 2nd class sheets and booklets.', 0.91, 0.680, true, false),
('2nd-xmas-incomplete-sheets-booklets', '2nd Class Xmas QR Incomplete', '2nd Class', 'Incomplete festive 2nd class sheets, booklets, or loose stamps.', 0.91, 0.670, true, false),
('ll-2nd-green-complete-sheets-25-50', '2nd Large Sheets', '2nd Class Large', 'Full sheets of 25 or 50 barcoded green large letter 2nd class.', 1.55, 0.750, true, false),
('ll-2nd-green-complete-booklets-4', '2nd Large Books of 4', '2nd Class Large', 'Complete booklets of 4 barcoded green large letter 2nd class.', 1.55, 0.750, true, false),
('ll-2nd-green-incomplete-sheets-booklets', '2nd Large Incomplete', '2nd Class Large', 'Incomplete large letter 2nd class sheets, booklets, or loose barcoded green stamps.', 1.55, 0.720, true, false),
('ll-2nd-xmas-complete-sheets-booklets', '2nd Large Xmas Complete', '2nd Class Large', 'Complete Christmas / festive barcoded large letter 2nd class sheets and booklets.', 1.55, 0.700, true, false),
('ll-2nd-xmas-incomplete-sheets-booklets', '2nd Large Xmas Incomplete', '2nd Class Large', 'Incomplete festive large letter 2nd class sheets, booklets, or loose stamps.', 1.55, 0.670, true, false),
('barcoded-1-5-complete-sheets-25', '£1 - £5 Barcoded, Complete Sheets 25', 'Barcoded Values', 'Enter total face value, decimal, without £ sign:', 1.00, 0.550, true, true),
('barcoded-1-5-incomplete-sheets-individual', '£1 - £5 Barcoded, Incomplete Sheets, Individual Stamps', 'Barcoded Values', 'Enter total face value, decimal, without £ sign:', 1.00, 0.500, true, true),
('barcoded-5p-50p-complete-sheets-25', '5p - 50p Barcoded, Complete Sheets 25 (NOT 1p or 2p sorry!)', 'Barcoded Values', 'Enter total face value, decimal, without £ sign:', 1.00, 0.500, true, true),
('barcoded-5p-50p-incomplete-sheets-individual', '5p - 50p Barcoded, Incomplete Sheets, Individual Stamps (NOT 1p or 2p sorry!)', 'Barcoded Values', 'Enter total face value, decimal, without £ sign:', 1.00, 0.450, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    group_name = EXCLUDED.group_name,
    description = EXCLUDED.description,
    face_value = EXCLUDED.face_value,
    rate = EXCLUDED.rate,
    is_barcoded = EXCLUDED.is_barcoded,
    allow_decimal = EXCLUDED.allow_decimal;
