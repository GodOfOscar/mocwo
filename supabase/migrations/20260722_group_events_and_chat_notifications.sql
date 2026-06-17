-- 1. Link Events to Community Groups
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.community_groups(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_group_id ON public.events(group_id);

-- 2. Function to handle notifications for group chat messages
CREATE OR REPLACE FUNCTION public.handle_group_chat_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a notification for every approved member of the group
  -- excluding the person who sent the message
  INSERT INTO public.notifications (user_id, actor_id, type)
  SELECT 
    gm.user_id, 
    NEW.user_id, 
    'message'
  FROM public.group_members gm
  WHERE gm.group_id = NEW.group_id
    AND gm.status = 'approved'
    AND gm.user_id != NEW.user_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger for new group chat messages
DROP TRIGGER IF EXISTS on_group_chat_message ON public.group_chat_messages;
CREATE TRIGGER on_group_chat_message
  AFTER INSERT ON public.group_chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_group_chat_notification();