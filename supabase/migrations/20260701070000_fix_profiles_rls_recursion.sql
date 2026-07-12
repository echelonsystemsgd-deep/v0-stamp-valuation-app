-- Fix RLS recursion on public.profiles table using a SECURITY DEFINER helper function

-- 1. Create helper function to fetch user roles securely (bypassing RLS check)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
DECLARE
    u_role public.user_role;
BEGIN
    SELECT role INTO u_role FROM public.profiles WHERE id = user_id;
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop recursive policies
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view profiles" ON public.profiles;

-- 3. Create non-recursive policies
CREATE POLICY "Admins can manage profiles" ON public.profiles
    FOR ALL TO authenticated USING (
        public.get_user_role(auth.uid()) = 'admin'::public.user_role
    );

CREATE POLICY "Staff can view profiles" ON public.profiles
    FOR SELECT TO authenticated USING (
        public.get_user_role(auth.uid()) = 'staff'::public.user_role
    );
