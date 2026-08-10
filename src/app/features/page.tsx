"use client";

import { motion } from "framer-motion";

export default function FeaturesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
  };

  return (
    <div className="flex flex-col min-h-screen relative pt-32 pb-24 px-6 max-w-[1400px] mx-auto w-full">
      <div className="mb-20">
        <span className="monolabel text-accent mb-6 block">// architecture</span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Intelligence, isolated.</h1>
        <p className="text-text-muted text-xl max-w-2xl font-light">
          A platform designed for professionals, built on a foundation of privacy, speed, and mathematical precision.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]"
      >
        {/* Box 1 (Large) - Col Span 2, Row Span 1 */}
        <motion.div variants={item} className="md:col-span-2 bg-surface/30 border border-border/50 p-8 flex flex-col justify-between group hover:border-accent/30 transition-colors">
          <div>
            <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">In-Memory Parsing</h3>
            <p className="text-text-muted leading-relaxed max-w-md">
              Zero-storage policy. Your PDF never touches an S3 bucket. We stream it to memory, extract the text, and pass it to <span className="text-accent">Gemini</span>. When the session ends, the data disappears.
            </p>
          </div>
          <div className="mt-8 bg-bg p-4 rounded-sm border border-border/50 font-mono text-xs text-text-muted overflow-hidden">
            <pre className="text-accent/80">
{`{
  "processing_mode": "memory_buffer",
  "storage_persistence": false,
  "extraction": "pdf-parse -> gemini"
}`}
            </pre>
          </div>
        </motion.div>

        {/* Box 2 (Tall) - Col Span 1, Row Span 2 */}
        <motion.div variants={item} className="md:row-span-2 bg-surface/30 border border-border/50 p-8 flex flex-col group hover:border-accent/30 transition-colors">
          <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">Vector Matching</h3>
          <p className="text-text-muted leading-relaxed mb-8">
            Keywords are obsolete. We transform your resume into a dense mathematical representation and rank jobs using <span className="text-accent">cosine similarity</span> in our pgvector database.
          </p>
          <div className="flex-1 border border-border/50 bg-bg p-4 flex flex-col justify-end">
            <div className="flex justify-between items-end mb-2">
              <span className="monolabel text-text-muted">Similarity Score</span>
              <span className="font-mono text-accent">0.8942</span>
            </div>
            <div className="w-full h-[2px] bg-border overflow-hidden">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: "89%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
              />
            </div>
            <span className="monolabel text-text-muted mt-4 block mt-auto">1 - (embedding {'<=>'} query)</span>
          </div>
        </motion.div>

        {/* Box 3 (Wide) - Col Span 1 */}
        <motion.div variants={item} className="bg-surface/30 border border-border/50 p-8 flex flex-col justify-center group hover:border-accent/30 transition-colors">
          <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">Dynamic Generation</h3>
          <p className="text-text-muted leading-relaxed">
            Gemini Flash reads between the lines, inferring implicitly stated skills from your experience bullet points and organizing them into a structured taxonomy.
          </p>
        </motion.div>

        {/* Box 4 (Small) - Col Span 1 */}
        <motion.div variants={item} className="bg-surface/30 border border-border/50 p-8 flex flex-col justify-center items-center text-center group hover:border-accent/30 transition-colors">
          <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">Export to PDF</h3>
          <p className="text-sm text-text-muted">Clean, print-ready generation.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
