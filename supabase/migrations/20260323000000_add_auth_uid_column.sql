-- Add auth_uid column to admin_users if it doesn't exist
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS auth_uid UUID;
-- Create an index on auth_uid for better query performance
CREATE INDEX IF NOT EXISTS admin_users_auth_uid_idx ON public.admin_users(auth_uid);
