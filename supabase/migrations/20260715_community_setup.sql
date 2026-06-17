-- Community Groups Table (Ministry, Youth, Discussion)
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  group_type TEXT NOT NULL, -- 'ministry', 'youth', 'discussion'
  image_url TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.community_groups(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL, -- 'testimony', 'discussion', 'youth', 'announcement'
  content TEXT NOT NULL,
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Post Interactions (Likes/Comments)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed Initial Groups
INSERT INTO public.community_groups (name, slug, group_type, description) VALUES
('Youth Movement', 'youth', 'youth', 'Connecting the next generation of kingdom leaders.'),
('Worship & Choir', 'choir', 'ministry', 'Updates and discussions for the music ministry.'),
('Ushering & Protocol', 'ushering', 'ministry', 'Excellence in service and hospitality.'),
('General Discussion', 'general', 'discussion', 'A space for members to share hope and fellowship.');

-- RLS Policies
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone logged in can view groups" ON public.community_groups FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Members can view posts" ON public.community_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can edit own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Members can view comments" ON public.post_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can post comments" ON public.post_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Members can view likes" ON public.post_likes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can toggle likes" ON public.post_likes FOR ALL USING (auth.role() = 'authenticated');

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_posts_group_id ON public.community_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.post_comments(post_id);