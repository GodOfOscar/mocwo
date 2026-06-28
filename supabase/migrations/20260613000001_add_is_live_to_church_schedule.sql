-- Add is_live column to church_schedule
ALTER TABLE IF EXISTS public.church_schedule
ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;
