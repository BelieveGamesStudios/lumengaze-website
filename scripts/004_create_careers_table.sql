-- Create careers table
CREATE TABLE IF NOT EXISTS public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range TEXT,
  employment_type TEXT DEFAULT 'Full-time',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "careers_select_public" ON public.careers FOR SELECT USING (TRUE);

-- Admin-only policies
CREATE POLICY "careers_insert_admin" ON public.careers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "careers_update_admin" ON public.careers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "careers_delete_admin" ON public.careers FOR DELETE USING (auth.uid() IS NOT NULL);
