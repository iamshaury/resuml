"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Sparkle, Target, ChartLineUp, CheckCircle, Briefcase } from "@phosphor-icons/react";

export default function LandingPage() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-[1200px] w-full mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border shadow-sm rounded-full mb-10 hover:shadow-md transition-shadow cursor-default">
              <Sparkle className="w-5 h-5 text-accent animate-pulse" weight="fill" />
              <span className="text-sm font-bold text-text-primary uppercase tracking-widest">The Resume Builder for Engineers</span>
            </motion.div>
            
            <motion.h1
              variants={fadeUp}
              className="text-7xl md:text-[7rem] lg:text-[8rem] font-extrabold tracking-tighter text-text-primary leading-[0.9] mb-8"
            >
              Don't just apply.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
                Get Hired.
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeUp}
              className="text-xl md:text-3xl text-text-muted font-medium leading-relaxed mb-14 max-w-3xl mx-auto"
            >
              Real-time, zero-friction resume building & application tracking. Tailor your profile for the modern job market instantly.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link
                href="/builder"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-text-primary text-white px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 hover:bg-accent transition-all duration-300 active:scale-95 shadow-xl shadow-accent/20"
              >
                Start Building Now
                <ArrowRight className="w-6 h-6" weight="bold" />
              </Link>
              <Link
                href="/applications"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-2 border-border text-text-primary px-12 py-6 rounded-3xl text-xl font-bold hover:border-text-primary hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Track Applications
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Interactive Hero Graphic (Gummy style) */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 50, damping: 20 }}
          className="mt-24 w-full max-w-[1000px] h-[450px] relative rounded-[3rem] bg-surface border border-border shadow-2xl p-6 overflow-hidden group hidden md:block"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent z-0" />
           <div className="relative z-10 flex h-full gap-6">
              {/* Sidebar Mock */}
              <div className="w-64 h-full bg-surface-hover rounded-3xl p-5 flex flex-col gap-6 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center text-white font-bold text-sm">AC</div>
                      <div>
                          <div className="text-sm font-bold text-text-primary">Alex Chen</div>
                          <div className="text-[10px] text-text-muted font-medium">Software Engineer</div>
                      </div>
                  </div>
                  <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl shadow-sm border border-border">
                          <FileText className="w-5 h-5 text-accent" weight="fill" />
                          <span className="text-xs font-bold text-text-primary">Resume Builder</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                          <Briefcase className="w-5 h-5 text-text-muted" weight="fill" />
                          <span className="text-xs font-medium text-text-muted">Job Tracker</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                          <ChartLineUp className="w-5 h-5 text-text-muted" weight="fill" />
                          <span className="text-xs font-medium text-text-muted">Analytics</span>
                      </div>
                  </div>
                  <div className="mt-auto bg-accent-light p-4 rounded-2xl border border-accent/10">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">ATS Score</div>
                      <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-text-primary leading-none">95</span>
                          <span className="text-xs text-success font-bold pb-1 flex items-center"><Target weight="fill" className="w-3 h-3 mr-1"/> High Match</span>
                      </div>
                  </div>
              </div>

              {/* Main Area Mock */}
              <div className="flex-1 h-full flex gap-6">
                  {/* Editor Side */}
                  <div className="flex-[0.8] bg-white rounded-3xl border border-border shadow-sm p-6 relative overflow-hidden group-hover:border-accent/30 transition-colors duration-500 flex flex-col">
                      <div className="flex items-center gap-2 mb-6">
                          <div className="w-3 h-3 rounded-full bg-danger/80" />
                          <div className="w-3 h-3 rounded-full bg-warning/80" />
                          <div className="w-3 h-3 rounded-full bg-success/80" />
                      </div>
                      <div className="space-y-4 font-mono text-sm">
                          <div className="flex gap-2"><span className="text-accent">const</span> <span className="text-text-primary font-bold">experience</span> = [</div>
                          <div className="pl-4 space-y-2">
                              <div>{`{`}</div>
                              <div className="pl-4 text-text-muted">title: <span className="text-success">"Senior Engineer"</span>,</div>
                              <div className="pl-4 text-text-muted">company: <span className="text-success">"TechNova"</span>,</div>
                              <div className="pl-4 text-text-muted">impact: <span className="text-success">"Scaled API by 300%"</span></div>
                              <div>{`}`}</div>
                          </div>
                          <div>]</div>
                      </div>
                      <div className="mt-auto w-full h-12 bg-accent/10 rounded-xl flex items-center justify-center gap-2 text-accent font-bold text-sm cursor-pointer hover:bg-accent/20 transition-colors">
                          <Sparkle weight="fill" className="animate-pulse" /> AI Optimize Experience
                      </div>
                  </div>

                  {/* Preview Side */}
                  <div className="flex-1 bg-surface-hover rounded-3xl border border-border p-6 relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10" />
                      <div className="text-center mb-6 border-b border-border pb-4">
                          <div className="text-xl font-black text-text-primary tracking-tight">ALEX CHEN</div>
                          <div className="text-[10px] text-accent font-bold tracking-widest mt-1">SENIOR SOFTWARE ENGINEER</div>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <div className="text-[10px] font-bold text-text-primary uppercase border-b border-border pb-1 mb-2">Experience</div>
                              <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-sm font-bold text-text-primary">TechNova</span>
                                  <span className="text-[10px] text-text-muted font-medium">2021 - Present</span>
                              </div>
                              <div className="text-xs font-semibold text-text-primary mb-1">Senior Engineer</div>
                              <ul className="space-y-1.5 mt-2">
                                  <li className="text-[10px] text-text-muted flex gap-2 leading-relaxed">
                                      <span className="text-accent mt-0.5">•</span> Engineered distributed microservices architecture using Node.js and gRPC.
                                  </li>
                                  <li className="text-[10px] text-text-muted flex gap-2 leading-relaxed">
                                      <span className="text-accent mt-0.5">•</span> Scaled primary API endpoints by 300% accommodating 10M+ daily requests.
                                  </li>
                              </ul>
                          </div>
                      </div>
                      {/* Hover Magic Wand */}
                      <div className="absolute bottom-6 right-6 w-14 h-14 bg-text-primary rounded-full shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <Sparkle className="text-white w-6 h-6" weight="fill" />
                      </div>
                  </div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-6">
              Everything you need.<br/>Nothing you don't.
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              A playful, zero-bloat environment designed strictly for action and results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[300px]">
            {/* Bento Box 1: Real-time Builder (Large) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 bg-white rounded-[3rem] p-10 border border-border shadow-lg relative overflow-hidden flex flex-col group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-accent/20" />
              <div className="relative z-10 flex-1">
                <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-accent/30">
                  <FileText className="w-8 h-8" weight="duotone" />
                </div>
                <h3 className="text-4xl font-bold mb-4 text-text-primary">Real-time Builder</h3>
                <p className="text-xl text-text-muted max-w-md">
                  Edit your resume and see changes instantly. No slow previews, no complicated formatting issues.
                </p>
              </div>
              
              <div className="relative z-10 mt-8 h-56 w-full bg-surface-hover border border-border/50 rounded-3xl p-6 flex gap-6 overflow-hidden shadow-inner">
                <div className="flex-[0.6] flex flex-col gap-3 font-mono text-xs">
                  <div className="text-text-primary font-bold bg-white px-3 py-2 rounded-lg border border-border shadow-sm">"Software Engineer"</div>
                  <div className="text-text-muted bg-white px-3 py-2 rounded-lg border border-border shadow-sm h-full flex flex-col">
                    <span className="mb-1 text-[10px] uppercase text-text-tertiary font-sans font-bold">Responsibilities</span>
                    <span>Optimized rendering pipeline, reducing load times by 40%...</span>
                    
                    <div className="mt-auto inline-flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded w-fit font-sans">
                      <Sparkle weight="fill" className="w-3 h-3" /> Auto-tailoring to job...
                    </div>
                  </div>
                </div>
                <div className="w-[1px] bg-border/80 my-2" />
                <div className="flex-1 bg-white border border-border shadow-md rounded-xl p-5 font-sans">
                  <div className="text-[10px] font-bold text-text-primary mb-2 border-b border-border pb-2 tracking-widest uppercase">EXPERIENCE</div>
                  <div className="text-[11px] font-black text-text-primary mb-1">Software Engineer</div>
                  <div className="text-[9px] text-text-muted leading-relaxed mt-2 space-y-1.5">
                    <div className="flex gap-1.5"><span className="text-accent">•</span> Optimized rendering pipeline, reducing load times by 40% using advanced memoization.</div>
                    <div className="flex gap-1.5"><span className="text-accent">•</span> Led a cross-functional team of 3 developers to ship the new analytics dashboard.</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bento Box 2: Smart Tracking */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-text-primary rounded-[3rem] p-10 shadow-lg relative overflow-hidden flex flex-col group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7" weight="duotone" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Smart Tracking</h3>
                <p className="text-white/70 text-lg mb-6">
                  Kanban-style boards to keep your applications organized from applied to hired.
                </p>
                <div className="flex gap-3 h-28">
                  <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Applied</div>
                    <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="text-[11px] font-bold text-white mb-0.5">Frontend Dev</div>
                      <div className="text-[9px] text-white/60">Stripe</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Interview</div>
                    <div className="bg-success/20 rounded-lg p-2.5 backdrop-blur-sm border border-success/30 hover:bg-success/30 transition-colors cursor-pointer">
                      <div className="text-[11px] font-bold text-success-light mb-0.5">React Eng</div>
                      <div className="text-[9px] text-success-light/70">Vercel</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bento Box 3: AI Intelligence */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-accent-light rounded-[3rem] p-10 border border-accent/10 shadow-lg flex flex-col group"
            >
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6">
                  <ChartLineUp className="w-7 h-7" weight="duotone" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-text-primary">AI Intelligence</h3>
                <p className="text-text-muted text-lg mb-6">
                  Vector-based matching to ensure your resume fits the exact job requirements.
                </p>
                
                <div className="mt-auto space-y-4 bg-white/60 rounded-2xl p-4 border border-border">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-text-primary">React & Next.js</span>
                      <span className="text-success">98% Match</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-success h-full w-[98%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-text-primary">System Architecture</span>
                      <span className="text-warning">75% Match</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-warning h-full w-[75%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-accent to-accent-secondary rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-accent/20"
          >
            <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[150%] bg-white/10 rounded-full blur-[80px]" />
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 relative z-10 tracking-tight">
              Ready to get to work?
            </h2>
            <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
              Join thousands of engineers who build resumes faster and apply smarter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link
                href="/builder"
                className="w-full sm:w-auto bg-white text-accent px-12 py-6 rounded-3xl text-xl font-bold hover:bg-surface-hover hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl"
              >
                Create Free Resume
              </Link>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle weight="fill" className="text-white w-6 h-6" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle weight="fill" className="text-white w-6 h-6" />
                <span>Zero setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
