-- Add unique constraints to prevent duplicate event registrations
-- Ensure one registration per email per event
ALTER TABLE public.event_registrations
ADD CONSTRAINT unique_event_email UNIQUE (event_id, email);

-- Ensure one registration per phone per event
ALTER TABLE public.event_registrations
ADD CONSTRAINT unique_event_phone UNIQUE (event_id, phone);
