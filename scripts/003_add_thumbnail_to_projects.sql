-- Add thumbnail_url, video_link, and download_link columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS video_link TEXT,
ADD COLUMN IF NOT EXISTS download_link TEXT;
