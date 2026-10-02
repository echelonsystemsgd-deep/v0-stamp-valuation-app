-- Migration: Add selling pathway and preferred contact columns to submissions
-- This supports the multiple selling options, logistical handoffs, and customer contact preferences

ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS selling_pathway TEXT DEFAULT 'box_and_send',
ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'phone',
ADD COLUMN IF NOT EXISTS shipping_preference TEXT DEFAULT 'prepaid_qr_label',
ADD COLUMN IF NOT EXISTS inspection_notes TEXT,
ADD COLUMN IF NOT EXISTS seller_contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS seller_contacted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.submissions.selling_pathway IS 'Pathway chosen by seller: calculator, box_and_send, photo_appraisal, vip_collection';
COMMENT ON COLUMN public.submissions.preferred_contact IS 'Preferred customer contact channel: phone, callback, email, either';
COMMENT ON COLUMN public.submissions.shipping_preference IS 'Logistics preference: prepaid_qr_label, self_ship, courier_pickup, home_visit';
COMMENT ON COLUMN public.submissions.inspection_notes IS 'Internal notes by appraiser regarding watermark, condition, and verification';
