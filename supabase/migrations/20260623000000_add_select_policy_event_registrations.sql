-- Add SELECT policy for authenticated users to view registrations
CREATE POLICY "Allow authenticated users to select registrations" 
ON public.event_registrations FOR SELECT 
TO authenticated 
USING (true);

-- Optionally, also add a public SELECT policy if needed
CREATE POLICY "Allow public to view registrations" 
ON public.event_registrations FOR SELECT 
TO public 
USING (true);
