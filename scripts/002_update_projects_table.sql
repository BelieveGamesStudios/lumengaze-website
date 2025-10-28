-- Add new columns to projects table for enhanced project management
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS video_link TEXT,
ADD COLUMN IF NOT EXISTS download_link TEXT;

-- Create a new table for project screenshots
CREATE TABLE IF NOT EXISTS public.project_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on project_screenshots
ALTER TABLE public.project_screenshots ENABLE ROW LEVEL SECURITY;

-- Public read policy for screenshots
CREATE POLICY "project_screenshots_select_public" ON public.project_screenshots FOR SELECT USING (TRUE);

-- Admin-only policies for screenshots
CREATE POLICY "project_screenshots_insert_admin" ON public.project_screenshots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "project_screenshots_update_admin" ON public.project_screenshots FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "project_screenshots_delete_admin" ON public.project_screenshots FOR DELETE USING (auth.uid() IS NOT NULL);
