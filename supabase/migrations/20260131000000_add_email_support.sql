-- Add email support for prayer requests
-- This migration allows prayer requests to be sent via email method

-- Update the comment/documentation
-- prayer_requests table now supports method: 'sms', 'whatsapp', or 'email'

-- No schema changes needed as the method field already supports any text value
-- The RLS policies already allow all necessary operations

-- Create index for faster filtering by method
CREATE INDEX IF NOT EXISTS idx_prayer_requests_method ON public.prayer_requests(method);
-- All existing policies remain in effect and support email method;
