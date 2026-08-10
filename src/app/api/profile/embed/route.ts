import { createClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { skills, profileData } = await request.json();

    if (!skills) {
      return NextResponse.json({ error: "Skills text is required to generate vector" }, { status: 400 });
    }

    // 1. Generate the profile vector using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text: skills }] },
      outputDimensionality: 1536
    } as any);
    const userVector = result.embedding.values;

    // 2. Optionally save to a profiles table if user is authenticated
    // Note: This relies on the cookie automatically picked up by createServerClient
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (user && !userError) {
      // Save the generated vector and profile data to the database
      const { error: dbError } = await supabase.from('profiles').upsert({
        id: user.id,
        vector: userVector,
        desired_roles: profileData.desiredRoles,
        skills: profileData.skills,
        experience_level: profileData.experienceLevel,
        updated_at: new Date().toISOString(),
      });
      
      if (dbError) {
        console.warn('Could not persist profile to Supabase (profiles table might not exist yet):', dbError.message);
      }
    }

    // Return the vector to the client to update the global store
    return NextResponse.json({ vector: userVector });
  } catch (error: any) {
    console.error('Profile Embed API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
