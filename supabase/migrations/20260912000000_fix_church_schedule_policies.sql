-- Fix the church_schedule policy set so service-role/admin CRUD can succeed
-- against the backend's Supabase client.

ALTER TABLE IF EXISTS public.church_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access for church_schedule" ON public.church_schedule;
CREATE POLICY "Allow public read access for church_schedule"
ON public.church_schedule
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow service role full access for church_schedule" ON public.church_schedule;
CREATE POLICY "Allow service role full access for church_schedule"
ON public.church_schedule
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated admin CRUD for church_schedule" ON public.church_schedule;
CREATE POLICY "Allow authenticated admin CRUD for church_schedule"
ON public.church_schedule
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
