-- Simplified RLS policies that don't require auth_uid (temporary fix)
-- This allows login without auth_uid being set

-- Admin users table policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.email() 
      AND au.role = 'admin' 
      AND au.is_active = true
    )
  );
CREATE POLICY "Admins can update admin users"
  ON public.admin_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.email() 
      AND au.role = 'admin' 
      AND au.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.email() 
      AND au.role = 'admin' 
      AND au.is_active = true
    )
  );
