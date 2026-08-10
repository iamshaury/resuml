# TCS Prime Interview Prep: Resuml Project

## 1. Project Introduction (The "Tell me about your project" answer)

**How to introduce yourself and the project:**

"Hello everyone, I'm Shaury. For my major project, I built **Resuml**, which is an AI-powered Resume Intelligence Suite. The core idea behind Resuml is to solve a common problem for job seekers: tailoring resumes and finding the exact right jobs. 

My platform does two main things:
1. **Resume Building & Parsing:** It allows users to upload a PDF resume, which I parse using Google Gemini Flash. The app extracts the structured data in-memory without storing the actual PDF, ensuring a privacy-first, zero-storage approach. Users can also edit their resumes directly on a canvas in real-time.
2. **Semantic Job Matching:** I built a custom Chrome Extension that scrapes live job listings from LinkedIn and pushes them to my backend. Instead of relying on basic keyword matching, I convert the user's resume and the job descriptions into vector embeddings using Google Gemini. I then store these in a PostgreSQL database (Supabase) and use `pgvector` to calculate the cosine similarity. This means the platform matches candidates with jobs based on actual contextual meaning and skills, not just exact keywords.

I built the frontend using Next.js 14 and Tailwind CSS for a highly responsive, premium feel, and managed state using Zustand."

---

## 2. Potential Interview Questions & Answers

**Q1: Why did you choose Next.js over plain React?**
**Answer:** I chose Next.js 14 specifically for its App Router and backend API capabilities. It allowed me to build a full-stack application within a single repository. Features like Server-Side Rendering (SSR) and built-in API routes (`/api/jobs`, `/api/match`) made it easy to securely handle file uploads and communicate with external APIs like Google Gemini without needing a separate Node.js backend.

**Q2: What is Semantic Matching and how is it different from Keyword Matching?**
**Answer:** Keyword matching just checks if a specific word (like "React") exists in both the resume and the job description. Semantic matching understands the *context*. By converting text into 1536-dimensional vector embeddings using Gemini, the system understands that "Frontend Developer" and "UI Engineer" are conceptually similar. I use `pgvector` in PostgreSQL to calculate the cosine similarity between the resume's vector and the job's vector to find the closest conceptual match.

**Q3: How do you handle user data privacy in your application?**
**Answer:** I implemented a "Zero-Storage" logic for resumes. When a user uploads a PDF, the file is processed entirely in-memory. `pdf-parse` extracts the text, sends it to the Gemini LLM for structuring, and then the file is immediately discarded. I do not store user PDFs in AWS S3 or Supabase Storage, which drastically reduces security risks and storage costs.

**Q4: Can you explain the architecture of your database?**
**Answer:** I use Supabase, which is built on PostgreSQL. The core table is `jobs`, which stores the title, company, a unique `job_url` to prevent duplicates, and a `vector(1536)` column for the embedding. I wrote a custom PostgreSQL function (RPC) called `match_jobs` that takes a query embedding and returns the top matches by calculating `1 - (jobs.embedding <=> query_embedding)` (Cosine Similarity). I also use `pg_cron` to auto-delete jobs older than 30 days to maintain performance.

**Q5: What was the biggest challenge you faced and how did you overcome it?**
**Answer:** One major challenge was integrating the Chrome Extension to scrape jobs and send them to my database without duplicates. I solved this by batching the scraped jobs, generating their vector embeddings via an API route, and using the `job_url` as a unique constraint in the Supabase database to perform 'upserts', ensuring my database stays clean and relevant.

---

## 3. Basic Code Examples to Practice for the Interview

For TCS Prime, interviewers often ask you to write basic code to prove your foundational knowledge. Practice these:

### A. Next.js API Route (Handling a POST request)
*They might ask: "Write a simple API endpoint in Next.js that receives data."*
```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### B. SQL Query for pgvector (Cosine Similarity)
*They might ask: "How exactly do you query vector similarity in SQL?"*
```sql
-- An example of how the RPC function 'match_jobs' works under the hood
SELECT 
    title, 
    company, 
    job_url, 
    1 - (embedding <=> '[0.12, 0.54, 0.33, ...]') AS similarity_score
FROM jobs
ORDER BY embedding <=> '[0.12, 0.54, 0.33, ...]'
LIMIT 5;
```
*(Note: `<=>` is the operator for cosine distance in pgvector. `1 - distance` gives similarity).*

### C. Zustand State Management vs React `useState`
*They might ask: "Write a quick example of how you manage state globally without Redux."*
```typescript
import { create } from 'zustand';

// Defining the store
interface ResumeState {
  name: string;
  setName: (name: string) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  name: '',
  setName: (newName) => set({ name: newName }),
}));

// Using it in a component
function ResumeComponent() {
  const { name, setName } = useResumeStore();
  return (
    <input value={name} onChange={(e) => setName(e.target.value)} />
  );
}
```

### D. Reverse a String / Array (Basic DSA)
*TCS Prime will likely test basic DSA. Be ready to write things out on paper or a whiteboard.*
```javascript
// Reverse a string
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Find maximum in an array without Math.max
function findMax(arr) {
    let max = arr[0];
    for(let i = 1; i < arr.length; i++) {
        if(arr[i] > max) max = arr[i];
    }
    return max;
}
```
