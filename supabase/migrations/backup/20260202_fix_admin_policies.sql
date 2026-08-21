-- Tighten admin RLS policies to verify auth_uid, role='admin', and is_active=true

-- Admin users table policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can update admin users"
  ON public.admin_users
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Partnerships
DROP POLICY IF EXISTS "Admins can view all partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can update partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admins can delete partnerships" ON public.partnerships;

CREATE POLICY "Admins can view all partnerships"
  ON public.partnerships
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can update partnerships"
  ON public.partnerships
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can delete partnerships"
  ON public.partnerships
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Repeat for other admin-protected tables (news, prayer_requests, membership_requests, contact_submissions, donations, events, media_gallery, announcements, testimonials)

DROP POLICY IF EXISTS "Admins can select news" ON public.news;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news;
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;

CREATE POLICY "Admins can select news"
  ON public.news
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can insert news"
  ON public.news
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can update news"
  ON public.news
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can delete news"
  ON public.news
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Prayer requests
DROP POLICY IF EXISTS "Admins can view prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can update prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can delete prayer requests" ON public.prayer_requests;

CREATE POLICY "Admins can view prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can update prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can delete prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Membership requests
DROP POLICY IF EXISTS "Admins can view membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can update membership requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can delete membership requests" ON public.membership_requests;

CREATE POLICY "Admins can view membership requests"
  ON public.membership_requests
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can update membership requests"
  ON public.membership_requests
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

CREATE POLICY "Admins can delete membership requests"
  ON public.membership_requests
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Contact submissions
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Donations
DROP POLICY IF EXISTS "Admins can view donations" ON public.donations;

CREATE POLICY "Admins can view donations"
  ON public.donations
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Events
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Media gallery
DROP POLICY IF EXISTS "Admins can manage media" ON public.media_gallery;

CREATE POLICY "Admins can manage media"
  ON public.media_gallery
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Announcements
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

CREATE POLICY "Admins can manage announcements"
  ON public.announcements
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));

-- Testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.auth_uid = auth.uid() AND au.role = 'admin' AND au.is_active = true));
