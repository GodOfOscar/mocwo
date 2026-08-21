-- Create live_messages table for Live page chat

CREATE TABLE IF NOT EXISTS public.live_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name text NOT NULL,
  message text NOT NULL,
  is_highlighted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS: allow inserts from authenticated anon or authenticated clients (adjust for your policy)
-- You may want to add policies in Supabase dashboard.

-- Enable realtime replication (if using Supabase Realtime, publication is automatic for public schema in newer projects)

COMMENT ON TABLE public.live_messages IS 'Messages posted in the Live page chat.';
