-- Force recreate policies for event_registrations - ensure admin-only deletion works
DROP POLICY IF EXISTS "Allow public to delete registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can delete event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can update event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view all event registrations" ON public.event_registrations;

-- Admin DELETE policy
CREATE POLICY "Admins can delete event registrations"
  ON public.event_registrations
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Admin UPDATE policy
CREATE POLICY "Admins can update event registrations"
  ON public.event_registrations
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Admin SELECT policy
CREATE POLICY "Admins can view all event registrations"
  ON public.event_registrations
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
