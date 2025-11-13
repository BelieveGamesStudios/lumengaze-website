-- Update blog_posts SELECT policy to allow authenticated users to read all posts
-- and keep published posts visible to everyone.

-- Drop the existing restrictive policy (if present)
DROP POLICY IF EXISTS "blog_posts_select_public" ON public.blog_posts;

-- Create a new policy that allows SELECT when either the post is published
-- OR the requester is authenticated (auth.uid() is not null).
CREATE POLICY "blog_posts_select_public" ON public.blog_posts
  FOR SELECT
  USING (published = TRUE OR auth.uid() IS NOT NULL);

-- Note: This change allows any authenticated user to read unpublished posts.
-- If you need stricter admin access, replace the auth.uid() condition with
-- a check against a specific role or user list.
