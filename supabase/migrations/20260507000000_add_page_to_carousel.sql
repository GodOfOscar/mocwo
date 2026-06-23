-- Add page column to carousel_images to support different carousels per page
ALTER TABLE public.carousel_images ADD COLUMN IF NOT EXISTS page text DEFAULT 'partnership';
-- Create index for page and order
DROP INDEX IF EXISTS idx_carousel_images_order;
DROP INDEX IF EXISTS idx_carousel_images_page_order;
CREATE INDEX idx_carousel_images_page_order ON public.carousel_images(page, order_index);
