-- Seed admin_users with a placeholder admin record
-- IMPORTANT: This only seeds the `public.admin_users` table used in RLS checks.
-- You MUST also create a corresponding Supabase Auth user with the same email and password
-- via the Supabase Dashboard (Authentication → Users → Create new user) or using the Admin API.
-- After creating the Auth user, the admin can sign in at /admin using the Auth email/password.

-- Replace the email below with the real admin email before running in production.
INSERT INTO public.admin_users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@example.com', -- admin email (placeholder)
  'placeholder',       -- placeholder password_hash; Supabase Auth handles actual password
  'Site Administrator',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;
-- Usage notes:
-- 1) Create the Supabase Auth user (same email) in the Supabase Dashboard and set a secure password.
-- 2) Alternatively, use the Supabase Admin API to create the user programmatically.
-- 3) Ensure the email in `admin_users` matches the Auth user's email exactly.
-- 4) After both records exist, the Admin page will allow sign-in via Supabase Auth, and the code
--    will check `admin_users` to confirm admin privileges.;
