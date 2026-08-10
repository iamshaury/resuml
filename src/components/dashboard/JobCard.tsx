"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOffice, 
  MapPin, 
  CurrencyDollar,
  ArrowRight,
  BookmarkSimple,
  ArrowSquareOut,
  Sparkle,
  Lightning
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useApplicationStore } from '@/store/useApplicationStore';

interface JobCardProps {
  job: any;
  index: number;
}

type MatchTier = 'strong' | 'good' | 'stretch' | 'none';

function getMatchTier(score: number | null): MatchTier {
  if (!score) return 'none';
  if (score >= 90) return 'strong';
  if (score >= 75) return 'good';
  if (score >= 50) return 'stretch';
  return 'none'; // hidden by default
}

const tierConfig = {
  strong: {
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    label: 'Strong Match',
    icon: Lightning,
  },
  good: {
    bar: 'bg-amber-400',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    label: 'Good Match',
    icon: Sparkle,
  },
  stretch: {
    bar: 'bg-slate-400',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-600',
    label: 'Stretch Role',
    icon: Sparkle,
  },
  none: {
    bar: 'bg-slate-200',
    bg: 'bg-surface',
    border: 'border-border',
    text: 'text-text-muted',
    label: '',
    icon: Sparkle,
  }
};

export default function JobCard({ job, index }: JobCardProps) {
  const { applications, addApplication, deleteApplication } = useApplicationStore();
  
  const matchScore = job.similarity ? Math.round(job.similarity * 100) : null;
  const tier = getMatchTier(matchScore);
  const config = tierConfig[tier];

  // Parse why-match chips from insight_keyword (comma-separated or array)
  const whyChips: string[] = job.why_chips 
    ? job.why_chips 
    : job.insight_keyword 
      ? job.insight_keyword.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 4)
      : [];

  const isSaved = applications.some(
    (app) => app.title === job.title && app.company === job.company
  );

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      const savedApp = applications.find(
        (app) => app.title === job.title && app.company === job.company
      );
      if (savedApp) {
        await deleteApplication(savedApp.id);
      }
    } else {
      await addApplication({
        title: job.title,
        company: job.company,
        stage: 'saved',
        matchScore: matchScore || undefined,
        job_url: job.url || job.job_url,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.04 }}
      className={`group bg-surface border-2 rounded-[32px] p-6 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 ${
        tier === 'strong' ? 'border-emerald-300 hover:border-emerald-400' : 
        tier === 'good' ? 'border-amber-300 hover:border-amber-400' : 
        'border-border/60 hover:border-accent/40'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-4 mb-6">
        {/* Company logo */}
        <div className="w-14 h-14 bg-surface-hover rounded-2xl flex items-center justify-center border-2 border-border overflow-hidden shrink-0 group-hover:rotate-3 transition-transform duration-500 ease-out shadow-sm">
          {job.logo_url ? (
            <img src={job.logo_url} alt={job.company} className="w-full h-full object-contain p-1.5" />
          ) : (
            <BuildingOffice className="w-6 h-6 text-text-tertiary" weight="fill" />
          )}
        </div>

        {/* Title + company */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-black text-[19px] text-text-primary tracking-tight line-clamp-1 mb-1">{job.title}</h3>
          <p className="text-text-muted text-[13px] font-bold truncate">{job.company}</p>
        </div>

        {/* Save button */}
        <button 
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border-2 shrink-0 ${
            isSaved 
              ? 'text-accent bg-accent-light border-accent/40 shadow-inner' 
              : 'text-text-tertiary bg-surface-hover border-transparent hover:text-text-primary hover:border-border hover:shadow-sm'
          }`}
        >
          <BookmarkSimple className="w-6 h-6" weight={isSaved ? "fill" : "bold"} />
        </button>
      </div>

      {/* Match confidence bar */}
      {matchScore !== null && tier !== 'none' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${config.text}`}>
              <config.icon className="w-4 h-4" weight="fill" />
              {config.label}
            </div>
            <span className={`font-mono text-xs font-bold ${config.text}`}>{matchScore}%</span>
          </div>
          <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: index * 0.04 + 0.2 }}
              className={`h-full rounded-full ${config.bar}`}
            />
          </div>
        </div>
      )}

      {/* Why this matches chips */}
      {whyChips.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-black text-text-tertiary mb-3">Match Vectors</p>
          <div className="flex flex-wrap gap-2">
            {whyChips.map((chip, i) => (
              <span 
                key={i}
                className="text-[11px] font-black px-3 py-1 bg-surface-hover text-text-primary rounded-xl border-2 border-border/60"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meta: location, salary */}
      <div className="flex flex-wrap gap-4 mb-6 mt-auto">
        <div className="flex items-center gap-1.5 text-text-muted text-[13px] font-bold">
          <MapPin className="w-4 h-4 shrink-0" weight="bold" />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-text-muted text-[13px] font-bold">
            <CurrencyDollar className="w-4 h-4 shrink-0" weight="bold" />
            <span className="font-mono">{job.salary}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <a 
          href={job.job_url || job.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 flex-[0.7] bg-bg border-2 border-border/80 text-text-primary px-4 py-3.5 rounded-2xl text-sm font-black hover:bg-surface-hover hover:border-text-tertiary hover:shadow-sm transition-all active:scale-95"
        >
          <ArrowSquareOut className="w-5 h-5" weight="bold" />
          View
        </a>
        <Link
          href={`/builder?tailor=${job.id}`}
          className="flex items-center justify-center gap-2 flex-1 bg-accent text-white px-4 py-3.5 rounded-2xl text-sm font-black transition-all hover:bg-accent-secondary hover:scale-[1.02] active:scale-95 group/btn shadow-lg shadow-accent/30"
        >
          <Sparkle className="w-5 h-5" weight="fill" />
          Tailor
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 ease-out" weight="bold" />
        </Link>
      </div>
    </motion.div>
  );
}
