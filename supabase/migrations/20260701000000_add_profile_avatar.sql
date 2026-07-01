-- Add avatar_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create avatars public bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for avatars bucket in storage.objects
-- 1. Public read access to avatars
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- 2. Allow authenticated users to upload avatars to their own folder {auth.uid()}/...
DROP POLICY IF EXISTS "Allow users to upload avatars" ON storage.objects;
CREATE POLICY "Allow users to upload avatars" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow authenticated users to update their own avatars
DROP POLICY IF EXISTS "Allow users to update own avatars" ON storage.objects;
CREATE POLICY "Allow users to update own avatars" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow authenticated users to delete their own avatars
DROP POLICY IF EXISTS "Allow users to delete own avatars" ON storage.objects;
CREATE POLICY "Allow users to delete own avatars" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);
