# Resuml: Project Documentation & Technical Overview

## 🚀 Overview
Resuml is a high-performance **Resume Intelligence Suite** designed to bridge the gap between job seekers and opportunities. It combines an AI-powered resume builder with a semantic job matching engine that leverages vector embeddings to find the most relevant roles based on a user's specific skill set.

---

## 🛠 Tech Stack

### Frontend
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS + Custom Vanilla CSS for high-fidelity "Premium" aesthetic.
*   **Animation**: Framer Motion (for smooth micro-interactions).
*   **State Management**: Zustand (Client-side persistence for resume data).
*   **PDF Generation**: `@react-pdf/renderer`.

### Backend & AI
*   **Database**: Supabase (PostgreSQL) + **pgvector** for semantic search.
*   **LLM (Parsing)**: Google Gemini Flash 1.5 (Fast, accurate resume structuring).
*   **Embeddings**: Google Gemini Embedding 2 (1536-dimensional vectors).
*   **Parsing**: `pdf-parse` for raw text extraction.

### Extension
*   **Chrome Extension**: A custom LinkedIn job scraper that pushes live job listings directly into the Resuml ecosystem.

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Styles
    classDef frontend fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef backend fill:#1e293b,stroke:#a78bfa,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef ai fill:#7f1d1d,stroke:#f87171,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef db fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef ext fill:#713f12,stroke:#facc15,stroke-width:2px,color:#fff,rx:8px,ry:8px

    User((🧑‍💻 User))
    ChromeExt["🧩 Chrome Extension<br/>(LinkedIn Scraper)"]:::ext
    
    subgraph Frontend ["🖥️ Next.js Frontend"]
        UI["React UI (Tailwind)"]:::frontend
        State["Zustand (Local State)"]:::frontend
        PDF["PDF Renderer"]:::frontend
    end
    
    subgraph Backend ["⚙️ API Routes"]
        API_Parse["/api/parse-resume"]:::backend
        API_Vector["/api/vectorize-resume"]:::backend
        API_Match["/api/match"]:::backend
        API_Jobs["/api/jobs"]:::backend
    end

    subgraph AI ["🧠 Gemini AI"]
        GeminiFlash["Gemini 1.5 Flash<br/>(Parser)"]:::ai
        GeminiEmbed["Gemini Embedding 2<br/>(Vectorization)"]:::ai
    end

    subgraph DB ["🗄️ Supabase"]
        PgVector[("PostgreSQL + pgvector")]:::db
        RPC["match_jobs (RPC)"]:::db
    end

    %% User interactions
    User -->|Uploads PDF / Types| UI
    UI <-->|Syncs| State
    State -->|Generates| PDF
    PDF -->|Downloads| User

    %% Parsing Flow
    UI -->|1. Upload PDF| API_Parse
    API_Parse -->|2. Extract text & prompt| GeminiFlash
    GeminiFlash -->|3. JSON structure| API_Parse
    API_Parse -->|4. Return data| UI

    %% Job Ingestion Flow
    ChromeExt -->|1. Scraped Jobs| API_Jobs
    API_Jobs -->|2. Text content| GeminiEmbed
    GeminiEmbed -->|3. 1536D Vectors| API_Jobs
    API_Jobs -->|4. Upsert (No dupes)| PgVector

    %% Semantic Match Flow
    UI -->|1. Request Match| API_Vector
    API_Vector -->|2. Resume text| GeminiEmbed
    GeminiEmbed -->|3. Resume Vector| API_Vector
    API_Vector -->|4. Forward Vector| API_Match
    API_Match -->|5. Call RPC| RPC
    RPC -->|6. Cosine Similarity| PgVector
    PgVector -->|7. Top matched jobs| API_Match
    API_Match -->|8. Return jobs| UI
```

---

## 📡 API Architecture
  
### 1. Resume Parsing (`/api/parse-resume`)
*   **Method**: `POST` (Multipart/FormData)
*   **Action**: Extracts raw text from an uploaded PDF, passes it to Gemini Flash with a specific schema prompt, and returns structured JSON.
*   **Optimization**: **Zero-Storage Logic**. Files are processed in-memory and never stored in S3/Supabase Storage to save space.
*   **Limit**: Strict **2MB** file size cap.

### 2. Job Ingestion (`/api/jobs`)
*   **Method**: `POST` (JSON)
*   **Action**: Receives batch job listings from the Chrome Extension.
*   **Processing**: Generates vector embeddings for each job (Title + Company) using Gemini.
*   **Persistence**: Upserts valid jobs into the `jobs` table, avoiding duplicates via URL constraints.

### 3. Resume Vectorization (`/api/vectorize-resume`)
*   **Method**: `POST` (JSON)
*   **Action**: Combines all resume sections (Skills, Experience, Summary) into a dense text block and generates a 1536D embedding.
*   **Purpose**: This vector represents the user's "Professional DNA" for matching.

### 4. Semantic Matching (`/api/match`)
*   **Method**: `POST` (JSON)
*   **Action**: Takes a resume vector and calls the `match_jobs` RPC in Supabase.
*   **Similarity**: Uses **Cosine Similarity** via `pgvector` to find jobs with the highest relevance score.

---

## 🗄 Database Schema (`supabase_setup.sql`)

### Tables
*   **`jobs`**:
    *   `id`: BigSerial (PK)
    *   `title`: Text
    *   `company`: Text
    *   `job_url`: Text (Unique)
    *   `embedding`: `vector(1536)` (The semantic signature)
    *   `created_at`: Timestamptz

### Custom Functions (RPC)
*   **`match_jobs`**: Performs the heavy lifting for similarity search.
    *   Input: `query_embedding`, `match_threshold`, `match_count`.
    *   Logic: `1 - (jobs.embedding <=> query_embedding)`.

### Maintenance
*   **`pg_cron`**: Automatically deletes jobs older than 30 days to keep the database lean and performant.

---

## ✨ Recent Optimizations
1.  **Storage Efficiency**: Completely eliminated PDF storage in S3. The app now operates with a "Privacy First / Storage Zero" approach where data is extracted and then the file is discarded.
2.  **Performance**: Batch embedding generation for jobs significantly reduces API latency during scraping.
3.  **UI/UX**: Implemented "Direct Canvas Editing" using `contentEditable`, allowing users to type directly onto the resume template while automatically updating the underlying state.
