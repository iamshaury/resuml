-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the jobs table with a vector column
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_url TEXT NOT NULL UNIQUE,
  embedding vector(1536), -- Gemini embeddings are 1536 dimensions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for faster similarity search
CREATE INDEX ON jobs USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 3.5 Enable RLS and create public access policies for the jobs cache
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON jobs
  FOR UPDATE USING (true);

-- 4. Create the matching function
CREATE OR REPLACE FUNCTION match_jobs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  title text,
  company text,
  job_url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    jobs.id,
    jobs.title,
    jobs.company,
    jobs.job_url,
    1 - (jobs.embedding <=> query_embedding) AS similarity
  FROM jobs
  WHERE 1 - (jobs.embedding <=> query_embedding) > match_threshold
  ORDER BY jobs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Enable pg_cron for nightly cleanup (if available in your Supabase tier)
-- Note: This requires the pg_cron extension to be enabled in Supabase settings.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule deletion of jobs older than 30 days at midnight every day
SELECT cron.schedule(
  'nightly-job-cleanup',
  '0 0 * * *',
  $$ DELETE FROM jobs WHERE created_at < NOW() - INTERVAL '30 days' $$
);

-- 6. Create profiles table for user profile persistence
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  vector vector(1536),
  desired_roles TEXT,
  skills TEXT,
  experience_level TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 7. Create applications table for tracking job applications (Kanban Board)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id BIGINT REFERENCES jobs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_url TEXT,
  match_score INT,
  stage TEXT NOT NULL DEFAULT 'saved', -- 'saved' | 'applied' | 'interview' | 'rejected'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

