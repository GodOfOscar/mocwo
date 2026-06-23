-- Complete Database Setup for MOC Website
-- This migration creates all necessary tables and configurations

-- ============================================
-- 1. ADMIN USERS TABLE (for admin authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- Create policies for admin access
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;
CREATE POLICY "Admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
-- Create trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 2. PARTNERSHIPS TABLE (for partnership donations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  level TEXT NOT NULL,
  amount DECIMAL(10,2),
  payment_method TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can view all partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can update partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can delete partnerships" ON public.partnerships;
-- Create policies for partnerships
CREATE POLICY "Anyone can create partnerships" 
ON public.partnerships 
FOR INSERT 
WITH CHECK (true);
CREATE POLICY "Admins can view all partnerships" 
ON public.partnerships 
FOR SELECT 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can update partnerships"
ON public.partnerships
FOR UPDATE
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can delete partnerships"
ON public.partnerships
FOR DELETE
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_partnerships_updated_at ON public.partnerships;
CREATE TRIGGER update_partnerships_updated_at
  BEFORE UPDATE ON public.partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 3. NEWS TABLE (for site news and stories)
-- ============================================
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
-- Enable row level security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can select news" ON public.news;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
-- Allow admins (from admin_users) to select and manage news
CREATE POLICY "Admins can select news"
  ON public.news
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can insert news"
  ON public.news
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can update news"
  ON public.news
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can delete news"
  ON public.news
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 4. LIVE MESSAGES TABLE (for live page chat)
-- ============================================
CREATE TABLE IF NOT EXISTS public.live_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name text NOT NULL,
  message text NOT NULL,
  is_highlighted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.live_messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.live_messages;
DROP POLICY IF EXISTS "Anyone can select messages" ON public.live_messages;
-- Create RLS policies for live messages
CREATE POLICY "Anyone can insert messages"
  ON public.live_messages
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Anyone can view messages"
  ON public.live_messages
  FOR SELECT
  USING (true);
-- ============================================
-- 5. PRAYER REQUESTS TABLE (for prayer AI page)
-- ============================================
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  prayer_text TEXT NOT NULL,
  method TEXT NOT NULL, -- 'sms' or 'whatsapp'
  status TEXT NOT NULL DEFAULT 'received', -- 'received', 'processed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can view prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can update prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can delete prayer requests" ON public.prayer_requests;
-- Create policies
CREATE POLICY "Anyone can create prayer requests"
  ON public.prayer_requests
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins can view prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can update prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can delete prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger for prayer_requests
DROP TRIGGER IF EXISTS update_prayer_requests_updated_at ON public.prayer_requests;
CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 6. MEMBERSHIP REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  membership_type TEXT, -- 'member', 'partner', etc.
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can view membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can update membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can delete membership requests" ON public.membership_requests;
-- Create policies
CREATE POLICY "Anyone can create membership requests"
  ON public.membership_requests
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins can view membership requests"
  ON public.membership_requests
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can update membership requests"
  ON public.membership_requests
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
CREATE POLICY "Admins can delete membership requests"
  ON public.membership_requests
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_membership_requests_updated_at ON public.membership_requests;
CREATE TRIGGER update_membership_requests_updated_at
  BEFORE UPDATE ON public.membership_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 7. CONTACT FORM SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'responded'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
-- Create policies
CREATE POLICY "Anyone can submit contact forms"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 8. DONATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  donation_type TEXT NOT NULL, -- 'offering', 'seed', 'tithe', 'other'
  payment_method TEXT, -- 'paystack', 'bank_transfer', 'cash', etc.
  payment_reference TEXT, -- Reference ID from payment gateway
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'successful', 'failed'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view donations" ON public.donations;
-- Create policies
CREATE POLICY "Anyone can create donations"
  ON public.donations
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins can view donations"
  ON public.donations
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_donations_updated_at ON public.donations;
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 9. EVENTS TABLE (for church events)
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  event_type TEXT, -- 'service', 'conference', 'camp', 'outreach', etc.
  image_url TEXT,
  registration_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
-- Create policies
CREATE POLICY "Anyone can view active events"
  ON public.events
  FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 10. MEDIA GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image', 'video'
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT, -- 'sunday', 'watch-night', 'camps', 'outreach', 'other'
  tags TEXT[], -- Array of tags
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view media" ON public.media_gallery;
DROP POLICY IF EXISTS "Admins can manage media" ON public.media_gallery;
-- Create policies
CREATE POLICY "Anyone can view media"
  ON public.media_gallery
  FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage media"
  ON public.media_gallery
  FOR ALL
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_media_gallery_updated_at ON public.media_gallery;
CREATE TRIGGER update_media_gallery_updated_at
  BEFORE UPDATE ON public.media_gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 11. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT, -- 'urgent', 'important', 'info', 'event'
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
-- Create policies
CREATE POLICY "Anyone can view active announcements"
  ON public.announcements
  FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins can manage announcements"
  ON public.announcements
  FOR ALL
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 12. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  testimony TEXT NOT NULL,
  media_url TEXT, -- Optional image or video
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
-- Create policies
CREATE POLICY "Anyone can submit testimonials"
  ON public.testimonials
  FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonials
  FOR SELECT
  USING (status = 'approved');
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials
  FOR ALL
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Create trigger
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_partnerships_email ON public.partnerships(email);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON public.partnerships(status);
CREATE INDEX IF NOT EXISTS idx_partnerships_created_at ON public.partnerships(created_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON public.prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_membership_requests_email ON public.membership_requests(email);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON public.membership_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON public.donations(email);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);
CREATE INDEX IF NOT EXISTS idx_media_gallery_category ON public.media_gallery(category);
CREATE INDEX IF NOT EXISTS idx_media_gallery_is_featured ON public.media_gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_start_date ON public.announcements(start_date);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at);
CREATE INDEX IF NOT EXISTS idx_live_messages_created_at ON public.live_messages(created_at);
-- ============================================
-- DONE
-- ============================================
-- All tables have been created with proper RLS policies and triggers;
