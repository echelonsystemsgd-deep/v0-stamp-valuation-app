-- Create submission_messages table for seller-admin chat
CREATE TABLE IF NOT EXISTS public.submission_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_read_by_admin BOOLEAN DEFAULT FALSE NOT NULL,
    is_read_by_seller BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE public.submission_messages ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid conflict on migration re-run
DROP POLICY IF EXISTS "Sellers can view own submission messages" ON public.submission_messages;
DROP POLICY IF EXISTS "Sellers can insert own submission messages" ON public.submission_messages;

-- RLS Policies
CREATE POLICY "Sellers can view own submission messages" ON public.submission_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions s 
        WHERE s.id = submission_messages.submission_id 
        AND (s.user_id = auth.uid() OR s.guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Sellers can insert own submission messages" ON public.submission_messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.submissions s 
        WHERE s.id = submission_messages.submission_id 
        AND s.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add to Realtime publication
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Check if tables are already in publication before adding to prevent errors
DO $$
BEGIN
    -- Add submissions if not present
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_rel pr 
        JOIN pg_class c ON pr.prrelid = c.oid 
        JOIN pg_publication p ON pr.prpubid = p.oid 
        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'submissions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
    END IF;

    -- Add submission_messages if not present
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_rel pr 
        JOIN pg_class c ON pr.prrelid = c.oid 
        JOIN pg_publication p ON pr.prpubid = p.oid 
        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'submission_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.submission_messages;
    END IF;
END $$;
