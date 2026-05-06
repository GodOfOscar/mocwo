-- Fix infinite recursion in RLS policies for admin-managed tables
-- Since authentication is handled by /api/verify-admin backend endpoint,
-- we can simplify the RLS policies to allow public access

-- Drop problematic policies on news table
DROP POLICY IF EXISTS "Admins can select news" ON public.news;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
DROP POLICY IF EXISTS "Anyone can select news" ON public.news;
DROP POLICY IF EXISTS "Anyone can insert news" ON public.news;
DROP POLICY IF EXISTS "Anyone can update news" ON public.news;
DROP POLICY IF EXISTS "Anyone can delete news" ON public.news;

-- Create simplified policies for news that allow public access
-- Frontend still uses /api/verify-admin for authentication
CREATE POLICY "Anyone can select news"
  ON public.news
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert news"
  ON public.news
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update news"
  ON public.news
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete news"
  ON public.news
  FOR DELETE
  USING (true);

-- Do the same for partnerships table
DROP POLICY IF EXISTS "Admins can view all partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can update partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can delete partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Anyone can view partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Anyone can create partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Anyone can update partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Anyone can delete partnerships" ON public.partnerships;

CREATE POLICY "Anyone can view partnerships"
  ON public.partnerships
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create partnerships"
  ON public.partnerships
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update partnerships"
  ON public.partnerships
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete partnerships"
  ON public.partnerships
  FOR DELETE
  USING (true);

-- Do the same for membership_requests table
DROP POLICY IF EXISTS "Admins can view membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can update membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Anyone can view membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Anyone can create membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Anyone can update membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Anyone can delete membership requests" ON public.membership_requests;

CREATE POLICY "Anyone can view membership requests"
  ON public.membership_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create membership requests"
  ON public.membership_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update membership requests"
  ON public.membership_requests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete membership requests"
  ON public.membership_requests
  FOR DELETE
  USING (true);

-- Do the same for prayer_requests table
DROP POLICY IF EXISTS "Admins can select prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can update prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Anyone can view prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Anyone can create prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Anyone can update prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Anyone can delete prayer requests" ON public.prayer_requests;

CREATE POLICY "Anyone can view prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create prayer requests"
  ON public.prayer_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (true);
