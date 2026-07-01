-- Migration to add bank_name to profile_payout_details
ALTER TABLE public.profile_payout_details ADD COLUMN IF NOT EXISTS bank_name TEXT;
