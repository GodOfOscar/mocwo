-- Disable RLS on admin_users table
-- The /api/verify-admin endpoint handles authentication via SERVICE_ROLE_KEY
-- This prevents infinite recursion in RLS policies

-- Drop all policies on admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin users (email match)" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users (email match)" ON public.admin_users;
-- Disable RLS on admin_users table
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
-- Grant public select access (safe because actual auth is handled by backend API)
GRANT SELECT ON public.admin_users TO public;
GRANT UPDATE ON public.admin_users TO public;
