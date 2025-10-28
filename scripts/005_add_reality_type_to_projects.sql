-- Add reality_type column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS reality_type TEXT DEFAULT 'AR';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_reality_type ON public.projects(reality_type);
