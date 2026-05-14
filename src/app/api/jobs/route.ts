import { createAdminClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Job {
  title: string;
  company: string;
  url: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ 
  model: "gemini-embedding-2"
});

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  const supabase = await createAdminClient();
  try {
    const body = await request.json();
    const { jobs } = body;

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: 'No jobs received' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    console.log(`🚀 Processing ${jobs.length} jobs for embeddings...`);

    // 2. Filter and format basic job data
    let validJobs = (jobs as Job[])
      .filter((job) => job.title && job.company && job.url)
      .map((job) => ({
        title: job.title,
        company: job.company,
        job_url: job.url,
      }));

    if (validJobs.length === 0) {
      return NextResponse.json({ success: true, message: "No valid jobs to process." }, { 
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 2.5 Manually deduplicate incoming jobs to prevent duplicate inserts
    // Fetch existing URLs or Title-Company pairs
    const { data: existingJobs } = await supabase.from('jobs').select('title, company');
    
    const existingSet = new Set();
    if (existingJobs) {
      existingJobs.forEach(job => existingSet.add(`${job.title}-${job.company}`));
    }

    // Also deduplicate the incoming batch itself
    const newUniqueSet = new Set();
    validJobs = validJobs.filter(job => {
      const key = `${job.title}-${job.company}`;
      if (existingSet.has(key) || newUniqueSet.has(key)) {
        return false;
      }
      newUniqueSet.add(key);
      return true;
    });

    if (validJobs.length === 0) {
      return NextResponse.json({ success: true, message: "All jobs are duplicates, ignored." }, { 
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    console.log(`🚀 Found ${validJobs.length} new unique jobs. Processing embeddings...`);

    // 3. Generate Vector Embeddings in Batch
    // We combine Title and Company to give the vector more semantic context
    const embeddingRequests = validJobs.map((job) => ({
      content: { 
        role: 'user', 
        parts: [{ text: `${job.title} at ${job.company}` }] 
      },
      outputDimensionality: 1536
    }));

    const batchResult = await embeddingModel.batchEmbedContents({
      requests: embeddingRequests,
    });

    // 4. Attach embeddings to job objects
    const jobsWithEmbeddings = validJobs.map((job, index) => ({
      ...job,
      embedding: batchResult.embeddings[index].values,
    }));

    console.log(`✅ Generated ${jobsWithEmbeddings.length} embeddings. Saving to Supabase...`);

    // 5. Insert into Supabase 'jobs' table
    const { error } = await supabase
      .from('jobs')
      .insert(jobsWithEmbeddings);

    if (error) {
      if (error.code === '23505') {
        console.log("Ignored some duplicate jobs.");
      } else {
        throw error;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed and saved ${jobsWithEmbeddings.length} jobs with embeddings.` 
    }, { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error: any) {
    console.error("Backend Error:", error.message);
    
    // Handle Quota Exceeded (429) specifically
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json({ 
        error: 'Rate limit reached', 
        details: 'Gemini embedding quota exceeded. Please wait a few minutes or upgrade your plan.' 
      }, { 
        status: 429,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    return NextResponse.json({ error: 'Failed to process/save jobs', details: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}