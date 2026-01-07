-- Rename reality_type column to app_type and update index/default
ALTER TABLE public.projects RENAME COLUMN IF EXISTS reality_type TO app_type;

-- Ensure default remains AR
ALTER TABLE public.projects ALTER COLUMN app_type SET DEFAULT 'AR';

-- Create index for app_type
CREATE INDEX IF NOT EXISTS idx_projects_app_type ON public.projects(app_type);

-- Drop old index if present
DROP INDEX IF EXISTS idx_projects_reality_type;