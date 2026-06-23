-- Add support for media in group chats
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS image_url TEXT;