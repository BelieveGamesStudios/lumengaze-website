-- Create career_applications table to store job applications
-- Run this migration in your Supabase SQL editor or via your migration workflow

CREATE TABLE IF NOT EXISTS public.career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid REFERENCES public.careers(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  phone text,
  cv_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.career_applications IS 'Stores applications submitted from the careers page';
