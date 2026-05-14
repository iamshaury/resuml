import { createPublicClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createPublicClient();
    const { query } = await request.json();

    let dbQuery = supabase.from('jobs').select('*');
    
    if (query && query.trim() !== '') {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,company.ilike.%${query}%`);
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    const { data: jobs, error } = await dbQuery.limit(1000);

    if (error) {
      throw error;
    }

    // Deduplicate by title and company
    const uniqueJobs = [];
    const seen = new Set();
    
    for (const job of (jobs || [])) {
      const key = `${job.title}-${job.company}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
      if (uniqueJobs.length >= 15) break;
    }

    return NextResponse.json({ jobs: uniqueJobs });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
