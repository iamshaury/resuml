"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOffice, 
  MapPin, 
  Calendar, 
  CurrencyDollar,
  ArrowRight,
  ChartPie,
  Sparkle
} from '@phosphor-icons/react';
import Link from 'next/link';

interface JobCardProps {
  job: any;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  // Use actual similarity from DB, fallback to null if not present
  const matchScore = job.similarity ? Math.round(job.similarity * 100) : null;
  
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-text-primary bg-surface border-border';
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-text-primary bg-surface border-border';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-border rounded-[2rem] p-6 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.03] hover:border-text-tertiary/30"
    >
      {/* Perpetual micro-interaction glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      {/* Match Score Indicator (only show if valid) */}
      {matchScore !== null && (
        <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-[10px] border text-xs font-bold flex items-center gap-1.5 ${getScoreColor(matchScore)}`}>
          <Sparkle weight="fill" className="w-3.5 h-3.5" />
          {matchScore}% Match
        </div>
      )}

      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border border-border overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
          {job.logo_url ? (
            <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
          ) : (
            <BuildingOffice className="w-7 h-7 text-text-tertiary" />
          )}
        </div>
        <div className="flex-1 pr-16">
          <h3 className="font-bold text-xl text-text-primary line-clamp-1 mb-1">{job.title}</h3>
          <p className="text-text-muted text-sm font-medium">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 text-text-primary text-xs font-semibold px-3 py-1.5 bg-surface rounded-lg border border-border/50">
          <MapPin className="w-3.5 h-3.5 text-text-muted" />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-text-primary text-xs font-semibold px-3 py-1.5 bg-surface rounded-lg border border-border/50">
            <CurrencyDollar className="w-3.5 h-3.5 text-text-muted" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      {(job.insight_keyword || job.insight_reason) && (
        <div className="space-y-2 mb-8 relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-text-tertiary">
            <ChartPie className="w-3.5 h-3.5" />
            AI Insight
          </div>
          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
            "Based on your background in <span className="font-medium text-text-primary">{job.insight_keyword}</span>, you're highly qualified for this role's <span className="font-medium text-text-primary">{job.insight_reason}</span> requirements."
          </p>
        </div>
      )}

      {/* Flex spacer to push buttons to bottom if insight is missing */}
      <div className="flex-1" />

      <div className="mt-auto flex items-center gap-3 relative z-10">
        <Link 
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-border text-text-primary px-4 py-3 rounded-2xl text-sm font-bold hover:bg-surface transition-all active:scale-[0.98]"
        >
          Details
        </Link>
        <Link
          href={`/builder?tailor=${job.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-4 py-3 rounded-2xl text-sm font-bold hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent/10 transition-all active:scale-[0.98] group/btn"
        >
          Tailor
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
