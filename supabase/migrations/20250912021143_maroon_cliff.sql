/*
  # Storage Policies for Letters Bucket

  1. Storage Policies
    - Users can upload files to their own folder
    - Users can view their own files
    - Users can delete their own files
    - Admins can access all files

  2. Security
    - Files are organized by user email/ID
    - Proper RLS policies for secure access
*/

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'letters' AND 
    (storage.foldername(name))[1] = auth.jwt() ->> 'email'
  );

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'letters' AND 
    (storage.foldername(name))[1] = auth.jwt() ->> 'email'
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'letters' AND 
    (storage.foldername(name))[1] = auth.jwt() ->> 'email'
  );

-- Policy: Admins can access all files
CREATE POLICY "Admins can access all files" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'letters' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: Public access for signed URLs (if needed)
CREATE POLICY "Allow public access for signed URLs" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'letters');