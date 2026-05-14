import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json();

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
    }

    // Combine all resume fields into a single string for embedding
    const combinedText = `
      Name: ${resumeData.name}
      Summary: ${resumeData.summary}
      Skills: ${resumeData.skills}
      Experience: ${resumeData.experience}
      Education: ${resumeData.education}
      Projects: ${resumeData.projects}
    `.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text: combinedText }] },
      outputDimensionality: 1536
    } as any);

    const embedding = result.embedding.values;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('Resume vectorization error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
