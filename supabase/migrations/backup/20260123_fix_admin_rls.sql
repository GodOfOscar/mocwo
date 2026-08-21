-- Fix RLS Policies for Admin Users Table
-- This allows users to check if they are admins during login

-- Drop the old incorrect policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;

-- Create new policy that allows:
-- 1. Public access to check if an email exists in admin_users (for login)
-- 2. Admins to view and update their own records

DROP POLICY IF EXISTS "Allow public to check admin access" ON public.admin_users;
CREATE POLICY "Allow public to check admin access"
  ON public.admin_users
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update their own record" ON public.admin_users;
CREATE POLICY "Admins can update their own record"
  ON public.admin_users
  FOR UPDATE
  USING (email = auth.email())
  WITH CHECK (email = auth.email());
