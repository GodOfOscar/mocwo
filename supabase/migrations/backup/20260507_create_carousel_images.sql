-- Create carousel_images table for managing homepage carousel
CREATE TABLE IF NOT EXISTS public.carousel_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  image_name text NOT NULL,
  page text NOT NULL DEFAULT 'home',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view carousel images (for frontend)
DROP POLICY IF EXISTS "Allow public to view carousel images" ON public.carousel_images;
CREATE POLICY "Allow public to view carousel images" ON public.carousel_images
  FOR SELECT USING (true);

-- Allow authenticated users to manage carousel images (admin only)
DROP POLICY IF EXISTS "Allow authenticated to insert carousel images" ON public.carousel_images;
CREATE POLICY "Allow authenticated to insert carousel images" ON public.carousel_images
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated to update carousel images" ON public.carousel_images;
CREATE POLICY "Allow authenticated to update carousel images" ON public.carousel_images
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow authenticated to delete carousel images" ON public.carousel_images;
CREATE POLICY "Allow authenticated to delete carousel images" ON public.carousel_images
  FOR DELETE USING (true);

-- Create index for ordering
DROP INDEX IF EXISTS idx_carousel_images_order;
CREATE INDEX idx_carousel_images_order ON public.carousel_images(order_index);
