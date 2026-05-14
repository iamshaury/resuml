"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass, FileText, Sparkle } from "@phosphor-icons/react";

export default function LandingPage() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none overflow-hidden">
          <div className="absolute top-24 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute top-48 right-1/4 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/10 rounded-full mb-8">
              <Sparkle className="w-4 h-4 text-accent" weight="fill" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Next-Gen Job Intelligence</span>
            </motion.div>
            
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-bold tracking-tight text-text-primary leading-[0.95] mb-8"
            >
              Stop searching. <br />
              Start <span className="text-accent italic font-serif">matching</span>.
            </motion.h1>
            
            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl text-text-muted font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Resuml uses AI vector embeddings to find jobs that actually fit your profile, not just your keywords.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-accent text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-accent/20 transition-all active:scale-95"
              >
                Find My Next Role
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/builder"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-surface border border-border text-text-primary px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-border/50 transition-all active:scale-95"
              >
                Build ATS Resume
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Split Section */}
      <section className="py-32 bg-surface/50 border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-accent/10 flex items-center justify-center rounded-2xl">
                <MagnifyingGlass className="w-8 h-8 text-accent" weight="bold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">AI-Powered Job Intelligence</h2>
              <p className="text-lg text-text-muted leading-relaxed">
                Traditional job boards are broken. We use semantic search to understand the context of your experience and match it against millions of live listings.
              </p>
              <ul className="space-y-4">
                {['Cosine similarity matching', 'Contextual career pathing', 'Skill-gap analysis'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-primary font-medium">
                    <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-video bg-bg rounded-3xl border border-border shadow-2xl overflow-hidden group"
            >
              {/* Mock Dashboard Preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-lg border border-border p-6 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-border/40 rounded-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-accent/5 rounded-lg border border-accent/10" />
                    <div className="h-24 bg-accent/5 rounded-lg border border-accent/10" />
                    <div className="h-24 bg-accent/5 rounded-lg border border-accent/10" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-12 w-full bg-surface rounded-lg border border-border" />
                    <div className="h-12 w-full bg-surface rounded-lg border border-border" />
                    <div className="h-12 w-full bg-surface rounded-lg border border-border" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Builder Highlight */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative aspect-square lg:aspect-video bg-bg rounded-3xl border border-border shadow-2xl overflow-hidden group"
            >
               {/* Mock Builder Preview */}
               <div className="absolute inset-0 bg-gradient-to-tr from-accent-secondary/5 to-transparent p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-lg border border-border p-6 flex items-start gap-4">
                  <div className="w-1/3 h-full border-r border-border pr-4 space-y-3">
                    <div className="h-3 w-full bg-border/40 rounded-full" />
                    <div className="h-3 w-2/3 bg-border/20 rounded-full" />
                    <div className="h-8 w-full bg-surface rounded-md border border-border" />
                    <div className="h-8 w-full bg-surface rounded-md border border-border" />
                  </div>
                  <div className="flex-1 h-full bg-surface/50 rounded-lg border border-border/50" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="w-16 h-16 bg-accent-secondary/10 flex items-center justify-center rounded-2xl">
                <FileText className="w-8 h-8 text-accent-secondary" weight="bold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">ATS-Friendly Builder</h2>
              <p className="text-lg text-text-muted leading-relaxed">
                Build a resume that machines can read and humans want to hire. Real-time scoring and AI content generation built-in.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-accent-secondary">95+</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Average ATS Score</div>
                </div>
                <div className="w-[1px] h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold text-accent-secondary">1-Click</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Tailoring Logic</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto bg-text-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-secondary/20 rounded-full blur-[100px]" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">Ready to outmatch the competition?</h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of professionals using AI to navigate the modern job market with precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white text-text-primary px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-accent hover:text-white transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
