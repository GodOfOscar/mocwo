-- Create news table for storing site news and stories
CREATE TABLE IF NOT EXISTS public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  date DATE,
  image TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable row level security (adjust policies as needed)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
-- Allow admins (from admin_users) to select and manage news
DROP POLICY IF EXISTS "Admins can select news" ON public.news;
CREATE POLICY "Admins can select news"
  ON public.news
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
CREATE POLICY "Admins can insert news"
  ON public.news
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
CREATE POLICY "Admins can update news"
  ON public.news
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
CREATE POLICY "Admins can delete news"
  ON public.news
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Trigger to keep updated_at current
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
