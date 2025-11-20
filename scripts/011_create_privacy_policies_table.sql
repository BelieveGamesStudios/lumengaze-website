-- Create privacy_policies table to store privacy policy content and versions
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.privacy_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privacy_policies ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "privacy_policies_read_public" ON public.privacy_policies
  FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY "privacy_policies_write_admin" ON public.privacy_policies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "privacy_policies_update_admin" ON public.privacy_policies
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "privacy_policies_delete_admin" ON public.privacy_policies
  FOR DELETE USING (auth.uid() IS NOT NULL);

COMMENT ON TABLE public.privacy_policies IS 'Stores privacy policy content and version history';
