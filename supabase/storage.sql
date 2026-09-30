-- =========================================================================
-- EXPLOUR — SUPABASE STORAGE BUCKET DESIGN & SECURITY POLICIES
-- =========================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('hero-images', 'hero-images', true),
  ('destination-images', 'destination-images', true),
  ('attraction-images', 'attraction-images', true),
  ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies: Public Read Access for all media buckets
CREATE POLICY "Public Read Hero Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

CREATE POLICY "Public Read Destination Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'destination-images');

CREATE POLICY "Public Read Attraction Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'attraction-images');

CREATE POLICY "Public Read User Uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-uploads');

-- 3. Storage Policies: Authenticated Insert for User Uploads
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');

-- 4. Storage Policies: Owner can delete their uploaded photos
CREATE POLICY "Users can delete their own uploaded photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid() = owner);
