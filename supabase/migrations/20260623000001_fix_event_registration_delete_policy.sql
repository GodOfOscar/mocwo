-- Add DELETE policy for event registrations - admin only
CREATE POLICY "Admins can delete event registrations"
  ON public.event_registrations
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Add UPDATE policy for admins
CREATE POLICY "Admins can update event registrations"
  ON public.event_registrations
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Add SELECT policy for visibility
CREATE POLICY "Admins can view all event registrations"
  ON public.event_registrations
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
