-- Add published column to projects table
-- Default true so existing projects remain visible
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.projects.published IS 'Whether the project is published (visible to site visitors)';

-- Note: After running this migration, use the admin UI to toggle published/draft states.
