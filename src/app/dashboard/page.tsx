"use client";

import React, { useState, useEffect } from 'react';
import SearchSection from '@/components/dashboard/SearchSection';
import JobCard from '@/components/dashboard/JobCard';
import SkeletonCard from '@/components/dashboard/SkeletonCard';
import { useResumeStore } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, MagnifyingGlass, Funnel, Info } from '@phosphor-icons/react';
import Link from 'next/link';

export type SearchMode = 'standard' | 'semantic' | 'matchmaking';

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('semantic');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { formData, resumeVector } = useResumeStore();

  // Fetch recent jobs on mount
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '' })
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchMode === 'semantic' && !query.trim()) {
      return;
    }

    setLoading(true);

    try {
      if (searchMode === 'matchmaking') {
        const hasResume = formData?.name || formData?.skills || formData?.experience;
        if (!hasResume) {
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
      } else if (searchMode === 'semantic') {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: query })
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      } else {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, location })
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* Top Bento Row: Header & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Intro Block */}
        <div className="lg:col-span-4 bg-white border border-border rounded-[2rem] p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 text-surface-hover group-hover:text-accent-light transition-colors duration-500 z-0">
            <Sparkle weight="fill" className="w-48 h-48 opacity-50" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-20"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Copilot Active</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
              Radar.
            </h1>
            <p className="text-text-muted font-medium text-lg max-w-[250px]">
              Discover opportunities mapped to your vector profile.
            </p>
          </div>
        </div>

        {/* Search Block */}
        <div className="lg:col-span-8 bg-white border border-border rounded-[2rem] p-2 flex flex-col justify-center">
          <SearchSection 
            query={query}
            setQuery={setQuery}
            location={location}
            setLocation={setLocation}
            onSearch={handleSearch}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
          />
        </div>

      </div>

      {/* Toolbar / Filters */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-text-primary">
          Suggested Roles <span className="text-text-muted ml-2 font-medium text-sm">{jobs.length} Matches</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-muted">
            <Info weight="bold" className="w-4 h-4" />
            {searchMode === 'standard' ? 'Ranked by Date Posted' : 'Ranked by Cosine Similarity'}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-text-primary hover:bg-surface transition-all">
            <Funnel className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard key={job.id || index} job={job} index={index} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white border border-dashed border-border rounded-[2rem]"
            >
              <div className="w-20 h-20 bg-surface rounded-[1.5rem] flex items-center justify-center mb-6">
                <MagnifyingGlass className="w-8 h-8 text-text-tertiary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {searchMode === 'matchmaking' && !(formData?.name || formData?.skills) 
                  ? "Profile Incomplete"
                  : !query.trim() && searchMode !== 'matchmaking'
                  ? "Ready to Scan"
                  : "No matches found"}
              </h3>
              <p className="text-text-muted max-w-md mx-auto text-lg mb-6">
                {searchMode === 'matchmaking' && !(formData?.name || formData?.skills) 
                  ? "We need your career profile to find jobs tailored perfectly to you."
                  : !query.trim() && searchMode !== 'matchmaking'
                  ? "Enter a role, skill, or objective above to start mapping opportunities."
                  : <span>Try broadening your search criteria or switching to <span className="text-accent font-bold">Semantic Mode</span>.</span>}
              </p>
              
              {searchMode === 'matchmaking' && !(formData?.name || formData?.skills) && (
                <Link 
                  href="/profile/setup"
                  className="px-6 py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent-secondary hover:-translate-y-0.5 transition-all"
                >
                  Complete Profile
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
