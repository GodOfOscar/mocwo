-- Table for group chat messages
CREATE TABLE IF NOT EXISTS public.group_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies: Only approved members can view messages
CREATE POLICY "Approved members can view chat messages" ON public.group_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_chat_messages.group_id
        AND user_id = auth.uid()
        AND status = 'approved'
    )
  );

-- Policies: Only approved members can send messages
CREATE POLICY "Approved members can insert chat messages" ON public.group_chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_chat_messages.group_id
        AND user_id = auth.uid()
        AND status = 'approved'
    )
  );

-- Enable Realtime for the group chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;