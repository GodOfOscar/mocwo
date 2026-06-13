-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to register (Insert only)
CREATE POLICY "Allow public registration" 
ON public.event_registrations FOR INSERT 
TO public 
WITH CHECK (true);