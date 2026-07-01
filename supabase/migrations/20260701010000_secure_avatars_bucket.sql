-- 1. Make the avatars bucket private
UPDATE storage.buckets
SET public = false
WHERE id = 'avatars';

-- 2. Drop the public read access policy
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;

-- 3. Create RLS policy for SELECT so only owners and admins can view
CREATE POLICY "Allow users to view own avatars and admins to view all" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'avatars' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- 4. Clean up existing profiles.avatar_url values to use relative storage paths
-- Extracts path after '/avatars/' if it contains a full public URL
UPDATE public.profiles
SET avatar_url = substring(avatar_url from '.+/storage/v1/object/public/avatars/(.+)$')
WHERE avatar_url LIKE '%/storage/v1/object/public/avatars/%';
