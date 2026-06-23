-- Add DELETE policies for admin deletion functionality
-- This migration enables admins to delete entries from partnerships, membership_requests, and prayer_requests tables

-- Add DELETE policy for partnerships
DROP POLICY IF EXISTS "Admins can delete partnerships" ON public.partnerships;
CREATE POLICY "Admins can delete partnerships"
  ON public.partnerships
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Add UPDATE policy for partnerships (if not already present)
DROP POLICY IF EXISTS "Admins can update partnerships" ON public.partnerships;
CREATE POLICY "Admins can update partnerships"
  ON public.partnerships
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Add DELETE policy for membership_requests
DROP POLICY IF EXISTS "Admins can delete membership requests" ON public.membership_requests;
CREATE POLICY "Admins can delete membership requests"
  ON public.membership_requests
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Add UPDATE policy for membership_requests (if not already present)
DROP POLICY IF EXISTS "Admins can update membership requests" ON public.membership_requests;
CREATE POLICY "Admins can update membership requests"
  ON public.membership_requests
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Add DELETE policy for prayer_requests
DROP POLICY IF EXISTS "Admins can delete prayer requests" ON public.prayer_requests;
CREATE POLICY "Admins can delete prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
-- Add UPDATE policy for prayer_requests (if not already present)
DROP POLICY IF EXISTS "Admins can update prayer requests" ON public.prayer_requests;
CREATE POLICY "Admins can update prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
