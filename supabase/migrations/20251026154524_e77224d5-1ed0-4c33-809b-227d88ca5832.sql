-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-images', 'clothing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for clothing images
CREATE POLICY "Anyone can view clothing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clothing-images');

CREATE POLICY "Users can upload their own clothing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clothing-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own clothing images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'clothing-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own clothing images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'clothing-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );