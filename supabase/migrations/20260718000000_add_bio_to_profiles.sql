-- Add bio column to profiles table for public member bios
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;