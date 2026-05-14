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
