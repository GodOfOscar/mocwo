-- Add school column to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS school TEXT;