import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Note: We skip uploading the full PDF to Supabase Storage to save space,
    // as we only need the extracted text for the AI parser.

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const data = await pdf(buffer);
    const rawText = data.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Use Gemini to structure the data
    // Use gemini-flash-latest which is available for this API key
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert resume parser. Extract the following information from the raw text of a resume and return it in valid JSON format.
      Raw Text:
      ${rawText}

      Required JSON format:
      {
        "name": "Full Name",
        "email": "Email Address",
        "phone": "Phone Number",
        "website": "Website or LinkedIn URL",
        "location": "City, Country",
        "summary": "Professional Summary",
        "skills": "Comma separated list of skills",
        "experience": "Detailed work experience with dates and descriptions",
        "education": "Education history",
        "projects": "Relevant projects"
      }
      
      If any information is missing, use an empty string. Only return the JSON.
    `;

    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    let text = response.text();

    // Clean up response in case it includes markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
