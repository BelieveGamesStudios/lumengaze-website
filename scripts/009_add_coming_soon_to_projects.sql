-- Add coming_soon column to projects table
-- Allows marking projects as "Coming Soon" while still visible to visitors
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.projects.coming_soon IS 'Whether the project is coming soon (visible but download disabled)';
