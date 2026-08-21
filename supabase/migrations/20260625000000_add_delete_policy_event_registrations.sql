-- Add DELETE policy to allow admin deletion of event registrations
DROP POLICY IF EXISTS "Allow public to delete registrations" ON public.event_registrations;
CREATE POLICY "Admins can delete event registrations"
  ON public.event_registrations
  FOR DELETE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Add UPDATE policy for admins (optional, for future editing)
DROP POLICY IF EXISTS "Admins can update event registrations" ON public.event_registrations;
CREATE POLICY "Admins can update event registrations"
  ON public.event_registrations
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()))
  WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));
