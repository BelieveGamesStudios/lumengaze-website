-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies for projects, blog, partners, events
CREATE POLICY "projects_select_public" ON public.projects FOR SELECT USING (TRUE);
CREATE POLICY "blog_posts_select_public" ON public.blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "partners_select_public" ON public.partners FOR SELECT USING (TRUE);
CREATE POLICY "events_select_public" ON public.events FOR SELECT USING (TRUE);

-- Allow anyone to submit contact forms
CREATE POLICY "contact_submissions_insert_public" ON public.contact_submissions FOR INSERT WITH CHECK (TRUE);

-- Admin-only policies (for authenticated users)
CREATE POLICY "projects_insert_admin" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_update_admin" ON public.projects FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "projects_delete_admin" ON public.projects FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "blog_posts_insert_admin" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "blog_posts_update_admin" ON public.blog_posts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "blog_posts_delete_admin" ON public.blog_posts FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "partners_insert_admin" ON public.partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "partners_update_admin" ON public.partners FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "partners_delete_admin" ON public.partners FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "events_insert_admin" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "events_update_admin" ON public.events FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "events_delete_admin" ON public.events FOR DELETE USING (auth.uid() IS NOT NULL);
