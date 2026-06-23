-- Create church_schedule table
CREATE TABLE IF NOT EXISTS public.church_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    day TEXT NOT NULL,
    time_string TEXT NOT NULL,
    description TEXT,
    details TEXT,
    image TEXT, -- Store the emoji here
    color TEXT, -- Tailwind gradient classes (e.g., "from-blue-500 to-blue-600")
    live_link TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.church_schedule ENABLE ROW LEVEL SECURITY;
-- Make policy creation idempotent
DROP POLICY IF EXISTS "Allow public read access for church_schedule" ON public.church_schedule;
-- Create policy to allow anyone to read the schedule
CREATE POLICY "Allow public read access for church_schedule" 
ON public.church_schedule FOR SELECT 
TO public 
USING (true);
-- Seed the table with your current data
INSERT INTO public.church_schedule (title, day, time_string, description, details, image, color, live_link, order_index)
VALUES 
('Sunday Service', 'Sunday', '8AM | 10AM', 'Our main worship service with powerful praise, worship, and the Word', 'Join us for an uplifting time of worship, fellowship, and life-changing messages', '🎵', 'from-blue-500 to-blue-600', 'https://www.youtube.com/live/yNB1h2ubyYM', 1),
('Monday TikTok Live', 'Monday', '9PM', 'A moment of prayer and prophetic encouragement', 'Experience God''s presence through prayer, prophecy, and spiritual breakthrough', '🌅', 'from-purple-500 to-purple-600', 'https://www.tiktok.com/@revprinceappaubediako', 2),
('Wednesday Midweek Service', 'Wednesday', '7PM', 'Midweek spiritual refreshing and Bible study', 'Dive deeper into God''s Word with interactive Bible study and prayer', '📖', 'from-green-500 to-green-600', 'https://www.youtube.com/@revprincebediakoappau', 3),
('Thursday TikTok Live', 'Thursday', '9PM', 'A moment of prayer and prophetic encouragement', 'Experience the power of prayer and prophetic ministry', '🙏', 'from-orange-500 to-orange-600', 'https://www.tiktok.com/@revprinceappaubediako', 4),
('Friday Prayer Encounter', 'Friday', '7PM', 'Intensive prayer and Prophetic session', 'Join us for powerful prayer sessions and spiritual warfare', '⛪', 'from-red-500 to-red-600', 'https://www.youtube.com/@revprincebediakoappau', 5);
