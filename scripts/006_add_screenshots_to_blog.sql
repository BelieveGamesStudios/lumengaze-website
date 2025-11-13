-- Add screenshots column to blog_posts table
-- This will store an array of screenshot image URLs as JSON
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]'::jsonb;

-- Add a comment to describe the column
COMMENT ON COLUMN public.blog_posts.screenshots IS 'Array of screenshot URLs for the blog post, stored as JSON array';
