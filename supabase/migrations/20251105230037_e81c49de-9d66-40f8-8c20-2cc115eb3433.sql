-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  graduation_year INTEGER,
  degree TEXT,
  profession TEXT,
  specialization TEXT,
  location TEXT,
  industry TEXT,
  bio TEXT,
  phone TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create forum categories
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create forum threads
CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create forum replies
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_range TEXT,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  posted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Create news articles table
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create mentorship applications table
CREATE TABLE public.mentorship_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goals TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  mentor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by authenticated users"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins and creators can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    auth.uid() = created_by
  );

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_categories
CREATE POLICY "Forum categories are viewable by everyone"
  ON public.forum_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.forum_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_threads
CREATE POLICY "Forum threads are viewable by everyone"
  ON public.forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON public.forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own threads"
  ON public.forum_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own threads"
  ON public.forum_threads FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_replies
CREATE POLICY "Forum replies are viewable by everyone"
  ON public.forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies"
  ON public.forum_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own replies"
  ON public.forum_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for job_postings
CREATE POLICY "Job postings are viewable by everyone"
  ON public.job_postings FOR SELECT
  USING (is_active = true OR auth.uid() = posted_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create job postings"
  ON public.job_postings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Admins and creators can update job postings"
  ON public.job_postings FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    auth.uid() = posted_by
  );

CREATE POLICY "Admins can delete job postings"
  ON public.job_postings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = applicant_id OR
    public.has_role(auth.uid(), 'admin') OR
    auth.uid() IN (SELECT posted_by FROM public.job_postings WHERE id = job_id)
  );

CREATE POLICY "Users can create their own applications"
  ON public.job_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = applicant_id);

-- RLS Policies for news_articles
CREATE POLICY "Published news articles are viewable by everyone"
  ON public.news_articles FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage news articles"
  ON public.news_articles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for mentorship_applications
CREATE POLICY "Users can view their own mentorship applications"
  ON public.mentorship_applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = applicant_id OR
    auth.uid() = mentor_id OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can create their own mentorship applications"
  ON public.mentorship_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Admins can manage mentorship applications"
  ON public.mentorship_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for newsletter_subscriptions
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscriptions"
  ON public.newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true),
  ('news-images', 'news-images', true),
  ('resumes', 'resumes', false);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for event images
CREATE POLICY "Event images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Admins can manage event images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for news images
CREATE POLICY "News images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Admins can manage news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for resumes
CREATE POLICY "Users can view their own resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_threads_updated_at
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_applications_updated_at
  BEFORE UPDATE ON public.mentorship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update forum thread reply count
CREATE OR REPLACE FUNCTION public.update_thread_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_threads
    SET reply_count = reply_count + 1
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_threads
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update thread reply count
CREATE TRIGGER update_thread_reply_count_trigger
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_thread_reply_count();

-- Insert default forum categories
INSERT INTO public.forum_categories (name, description) VALUES
  ('Networking', 'Connect with fellow alumni'),
  ('Career Development', 'Career advice and opportunities'),
  ('Events', 'Alumni events and gatherings'),
  ('Class Reunions', 'Organize and discuss class reunions'),
  ('General Discussion', 'General topics and discussions'),
  ('Academic Resources', 'Share academic resources and knowledge');