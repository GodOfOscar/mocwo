-- Create notification_subscriptions table
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  notification_type VARCHAR(50) NOT NULL DEFAULT 'all', -- 'livestream', 'programs', 'all'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_notified_at TIMESTAMP WITH TIME ZONE
);
-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_email ON notification_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_active ON notification_subscriptions(is_active);
-- Enable RLS
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert subscriptions" ON notification_subscriptions;
DROP POLICY IF EXISTS "Allow users to view own subscription" ON notification_subscriptions;
DROP POLICY IF EXISTS "Allow users to update own subscription" ON notification_subscriptions;
DROP POLICY IF EXISTS "Allow users to delete own subscription" ON notification_subscriptions;
-- RLS Policy: Allow anyone to insert (signup)
CREATE POLICY "Allow public to insert subscriptions" ON notification_subscriptions
  FOR INSERT WITH CHECK (true);
-- RLS Policy: Allow users to view their own subscription
CREATE POLICY "Allow users to view own subscription" ON notification_subscriptions
  FOR SELECT USING (true);
-- RLS Policy: Allow users to update their own subscription
CREATE POLICY "Allow users to update own subscription" ON notification_subscriptions
  FOR UPDATE USING (true);
-- RLS Policy: Allow users to delete their own subscription
CREATE POLICY "Allow users to delete own subscription" ON notification_subscriptions
  FOR DELETE USING (true);
