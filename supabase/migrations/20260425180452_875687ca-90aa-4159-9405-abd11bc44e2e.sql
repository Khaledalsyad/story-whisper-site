-- Create user_stories table
CREATE TABLE public.user_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  mood TEXT NOT NULL,
  user_name TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view stories"
ON public.user_stories FOR SELECT
USING (true);

-- Public insert (UGC, no auth for now)
CREATE POLICY "Anyone can create stories"
ON public.user_stories FOR INSERT
WITH CHECK (
  length(title) > 0 AND length(title) <= 120
  AND length(description) > 0 AND length(description) <= 2000
  AND length(location) > 0 AND length(location) <= 120
  AND length(mood) > 0 AND length(mood) <= 40
  AND length(user_name) > 0 AND length(user_name) <= 60
);

-- Allow public to update only the likes count via RPC below
CREATE OR REPLACE FUNCTION public.increment_story_likes(story_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  UPDATE public.user_stories
  SET likes = likes + 1
  WHERE id = story_id
  RETURNING likes INTO new_likes;
  RETURN new_likes;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_story_likes(UUID) TO anon, authenticated;

-- Storage bucket for story images
INSERT INTO storage.buckets (id, name, public)
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Story images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'stories');

CREATE POLICY "Anyone can upload story images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stories');
