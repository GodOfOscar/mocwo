-- Add auth_uid column to admin_users so policies can verify Supabase auth UIDs
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS auth_uid UUID;
-- Create index for fast lookups by auth_uid
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_uid ON public.admin_users(auth_uid);
-- NOTE: Run scripts/populate-admin-auth-uid.js to populate this column for existing admins;
