import { createPublicClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const supabase = createPublicClient();
    const { skills, vector } = await request.json();

    if (!skills && !vector) {
      return NextResponse.json({ error: "Skills or vector are required for matching" }, { status: 400 });
    }

    let userVector = vector;

    if (!userVector) {
      // 1. Turn user skills into a vector using the working model
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
      const result = await model.embedContent({
        content: { role: 'user', parts: [{ text: skills }] },
        outputDimensionality: 1536
      } as any);
      userVector = result.embedding.values;
    }

    // 2. Call the Supabase function via RPC
    const { data: matchedJobs, error } = await supabase.rpc('match_jobs', {
      query_embedding: userVector,
      match_threshold: 0.1, // Lowered threshold slightly to ensure some results during testing
      match_count: 1000,      // Fetch more to allow for deduplication
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw error;
    }

    // Deduplicate by title and company
    const uniqueJobs = [];
    const seen = new Set();
    
    for (const job of (matchedJobs || [])) {
      const key = `${job.title}-${job.company}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
      if (uniqueJobs.length >= 10) break; // Limit to 10 unique results
    }

    return NextResponse.json({ jobs: uniqueJobs });
  } catch (error: any) {
    console.error('Matching API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
