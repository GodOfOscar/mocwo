-- Add gender column to event_registrations
ALTER TABLE public.event_registrations
ADD COLUMN IF NOT EXISTS gender TEXT;
-- Optionally backfill or set constraints as needed.

-- Note: Run `supabase db push` or apply via psql to update the database.;
