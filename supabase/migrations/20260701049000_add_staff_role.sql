-- Phase 5 Pre-migration: Add 'staff' to user_role enum
ALTER TYPE public.user_role ADD VALUE 'staff';
