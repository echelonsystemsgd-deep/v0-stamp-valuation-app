-- Create trigger function to link guest submissions on email verification/signup
CREATE OR REPLACE FUNCTION public.link_guest_submissions_on_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- For UPDATE: check if confirmed_at transitioned from NULL to NOT NULL (or changed)
    -- For INSERT: check if confirmed_at is already NOT NULL
    IF (TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NOT NULL) OR
       (TG_OP = 'UPDATE' AND NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)) THEN
        
        -- 1. Create audit trail entries in submission_history before updating user_id
        INSERT INTO public.submission_history (submission_id, changed_by, old_status, new_status, notes)
        SELECT id, NEW.id, status, status, 'Linked guest submission to user account upon email verification'
        FROM public.submissions
        WHERE (guest_email = NEW.email OR LOWER(guest_email) = LOWER(NEW.email))
          AND user_id IS NULL;

        -- 2. Update the user_id on all matching guest submissions
        UPDATE public.submissions
        SET user_id = NEW.id
        WHERE (guest_email = NEW.email OR LOWER(guest_email) = LOWER(NEW.email))
          AND user_id IS NULL;
          
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_verified_link ON auth.users;

-- Bind the trigger to auth.users updates and inserts
CREATE TRIGGER on_auth_user_verified_link
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.link_guest_submissions_on_verification();

-- Ensure standard API roles have access to public tables, sequences, and functions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role, anon, authenticated;
