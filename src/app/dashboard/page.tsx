"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import JobCard from '@/components/dashboard/JobCard';
import SkeletonCard from '@/components/dashboard/SkeletonCard';
import { useResumeStore } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkle, 
  MagnifyingGlass, 
  Funnel, 
  SlidersHorizontal,
  Lightning,
  Warning,
  ToggleRight
} from '@phosphor-icons/react';
import Link from 'next/link';


export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1400px] mx-auto py-20 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-muted text-sm font-semibold">Loading matching workspace...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [query, setQuery] = useState('');
  const { formData, resumeVector } = useResumeStore();
  const hasProfile = !!(formData?.name || formData?.skills || formData?.experience);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLowMatches, setShowLowMatches] = useState(false);

  const fetchJobs = async (searchQuery: string) => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: searchQuery.trim() })
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      } else {
        if (!hasProfile) {
          setJobs([]);
          setLoading(false);
          return;
        }
        const bodyPayload: any = {};
        if (resumeVector && resumeVector.length > 0) {
          bodyPayload.vector = resumeVector;
        } else {
          bodyPayload.skills = `${formData.name || ''} ${formData.summary || ''} ${formData.skills || ''} ${formData.experience || ''}`.trim();
        }
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(query);
  }, [hasProfile]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchJobs(query);
  };

  // Filter low-match jobs by default
  const visibleJobs = useMemo(() => 
    showLowMatches 
      ? jobs 
      : jobs.filter(j => !j.similarity || j.similarity >= 0.5),
    [showLowMatches, jobs]
  );

  const strongCount = useMemo(() => jobs.filter(j => j.similarity && j.similarity >= 0.9).length, [jobs]);
  const goodCount = useMemo(() => jobs.filter(j => j.similarity && j.similarity >= 0.75 && j.similarity < 0.9).length, [jobs]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700 pb-20">
      
      {/* ── Header Row ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-accent">Match Feed</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary leading-none mb-4">
            Discover Roles
          </h1>
          <p className="text-text-muted text-lg md:text-xl font-bold max-w-xl leading-relaxed">
            Opportunities ranked by structural similarity to your professional vector.
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2 shrink-0">
          {strongCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Lightning weight="fill" className="w-3.5 h-3.5" />
              {strongCount} Strong
            </div>
          )}
          {goodCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400">
              <Sparkle weight="fill" className="w-3.5 h-3.5" />
              {goodCount} Good
            </div>
          )}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex flex-col gap-4">
        {/* Profile warning */}
        {!hasProfile && !query.trim() && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-sm text-amber-700 dark:text-amber-400 font-medium">
            <Warning className="w-5 h-5 shrink-0" weight="fill" />
            No profile found. 
            <Link href="/profile/setup" className="font-bold underline hover:no-underline">Set up your profile to get matches →</Link>
          </div>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative group w-full">
            <MagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-tertiary group-focus-within:text-accent transition-colors" weight="bold" />
            <input
              type="text"
              aria-label="Search jobs"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for a specific job title, skills, or company..."
              className="w-full pl-14 pr-6 py-5 bg-surface border-2 border-border/80 rounded-[24px] text-[15px] font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-5 bg-accent text-white text-[15px] font-black rounded-[24px] hover:bg-accent-secondary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-accent/30 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between py-5 border-b-2 border-border mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            Results
          </h2>
          <span className="text-[13px] font-black text-text-muted bg-surface border-2 border-border/80 px-3 py-1.5 rounded-xl shadow-sm">
            {visibleJobs.length} roles
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Show low matches toggle */}
          <button 
            onClick={() => setShowLowMatches(v => !v)}
            aria-pressed={showLowMatches}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-black border-2 transition-all ${
              showLowMatches 
                ? 'bg-surface border-border text-text-muted' 
                : 'bg-surface border-border/60 text-text-tertiary hover:text-text-muted hover:border-border'
            }`}
          >
            <ToggleRight className={`w-5 h-5 ${showLowMatches ? 'text-accent' : ''}`} weight={showLowMatches ? 'fill' : 'bold'} />
            Show low matches
          </button>
        </div>
      </div>

      {/* ── Job Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
          ) : visibleJobs.length > 0 ? (
            visibleJobs.map((job, index) => (
              <JobCard key={job.id || index} job={job} index={index} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface border border-dashed border-border rounded-2xl"
            >
              <div className="w-16 h-16 bg-surface-hover rounded-2xl flex items-center justify-center mb-4 border border-border">
                <MagnifyingGlass className="w-7 h-7 text-text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {!hasProfile && !query.trim() 
                  ? "Profile Needed"
                  : "No matches found"}
              </h3>
              <p className="text-text-muted max-w-sm text-sm mb-4">
                {!hasProfile && !query.trim() 
                  ? "Upload your resume to enable AI-powered job matching, or enter a search query above."
                  : "Try broadening your search terms."}
              </p>
              {!hasProfile && !query.trim() && (
                <Link 
                  href="/profile/setup"
                  className="px-5 py-2.5 bg-accent text-white font-bold rounded-xl text-sm shadow-md shadow-accent/20 hover:bg-accent-secondary hover:-translate-y-0.5 transition-all"
                >
                  Set Up Profile
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
