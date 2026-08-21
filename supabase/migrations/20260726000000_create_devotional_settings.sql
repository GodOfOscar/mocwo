-- Create devotional settings table for monthly devotional metadata

CREATE TABLE IF NOT EXISTS public.devotional_settings (
  month TEXT NOT NULL PRIMARY KEY,
  theme TEXT,
  bg_color TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.devotional_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can select devotional settings" ON public.devotional_settings;
CREATE POLICY "Public can select devotional settings"
  ON public.devotional_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage devotional settings" ON public.devotional_settings;
CREATE POLICY "Admins can manage devotional settings"
  ON public.devotional_settings
  FOR ALL
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

DROP TRIGGER IF EXISTS update_devotional_settings_updated_at ON public.devotional_settings;
CREATE TRIGGER update_devotional_settings_updated_at
  BEFORE UPDATE ON public.devotional_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
