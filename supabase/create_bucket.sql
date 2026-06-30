-- Create submissions private bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions',
  'submissions',
  false,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload submission images to their own folder {auth.uid()}/...
DROP POLICY IF EXISTS "Allow authenticated users to upload submission images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload submission images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow users to view their own submission images, and admins to view all
DROP POLICY IF EXISTS "Allow users to view own submission images" ON storage.objects;
CREATE POLICY "Allow users to view own submission images" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'submissions' AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- Policy 3: Allow anonymous uploads for guests to a 'guest' folder (guest/...)
DROP POLICY IF EXISTS "Allow guest users to upload submission images" ON storage.objects;
CREATE POLICY "Allow guest users to upload submission images" ON storage.objects
FOR INSERT TO anon WITH CHECK (
  bucket_id = 'submissions' AND (storage.foldername(name))[1] = 'guest'
);

-- Policy 4: Allow guests to view guest images (optional, or make public read, but restricted select is safer)
DROP POLICY IF EXISTS "Allow guest users to view guest images" ON storage.objects;
CREATE POLICY "Allow guest users to view guest images" ON storage.objects
FOR SELECT TO anon USING (
  bucket_id = 'submissions' AND (storage.foldername(name))[1] = 'guest'
);
