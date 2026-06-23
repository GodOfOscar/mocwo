-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The recipient
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The person who liked
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'like', 'comment'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Only the recipient can see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Only the recipient can mark them as read
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle like notifications automatically
CREATE OR REPLACE FUNCTION public.handle_like_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Find the owner of the post and create a notification
  -- but only if someone else liked it (don't notify self-likes)
  INSERT INTO public.notifications (user_id, actor_id, post_id, type)
  SELECT 
    p.user_id, 
    NEW.user_id, 
    NEW.post_id, 
    'like'
  FROM public.community_posts p
  WHERE p.id = NEW.post_id
    AND p.user_id != NEW.user_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to fire after a like is inserted
DROP TRIGGER IF EXISTS on_post_like ON public.post_likes;
CREATE TRIGGER on_post_like
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_notification();

-- Function to handle comment notifications
CREATE OR REPLACE FUNCTION public.handle_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the post author when someone comments, excluding self-comments
  INSERT INTO public.notifications (user_id, actor_id, post_id, type)
  SELECT 
    p.user_id, 
    NEW.user_id, 
    NEW.post_id, 
    'comment'
  FROM public.community_posts p
  WHERE p.id = NEW.post_id
    AND p.user_id != NEW.user_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to fire after a comment is inserted
DROP TRIGGER IF EXISTS on_post_comment ON public.post_comments;
CREATE TRIGGER on_post_comment
  AFTER INSERT ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_notification();

-- Enable Realtime for the notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;