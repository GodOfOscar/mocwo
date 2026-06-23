-- Create follows table to track member relationships
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policies for follows
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Function to notify followers on new post
CREATE OR REPLACE FUNCTION public.handle_post_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a notification for every follower of the person who posted
  INSERT INTO public.notifications (user_id, actor_id, post_id, type)
  SELECT 
    f.follower_id, 
    NEW.user_id, 
    NEW.id, 
    'post'
  FROM public.follows f
  WHERE f.following_id = NEW.user_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new community posts
DROP TRIGGER IF EXISTS on_community_post_inserted ON public.community_posts;
CREATE TRIGGER on_community_post_inserted
  AFTER INSERT ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_notification();