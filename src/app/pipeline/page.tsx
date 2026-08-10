"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookmarkSimple,
  PaperPlaneTilt,
  Handshake,
  X,
  Plus,
  Hourglass,
  BuildingOffice,
  DotsThree,
  ArrowRight
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useApplicationStore, Stage, PipelineJob } from '@/store/useApplicationStore';

const STAGES: { id: Stage; label: string; icon: any; color: string; bg: string; border: string }[] = [
  { id: 'saved',     label: 'Saved',     icon: BookmarkSimple, color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200' },
  { id: 'applied',   label: 'Applied',   icon: PaperPlaneTilt, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'  },
  { id: 'interview', label: 'Interview', icon: Handshake,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'rejected',  label: 'Rejected',  icon: X,             color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200'   },
];

export default function PipelinePage() {
  const { 
    applications: jobs, 
    fetchApplications, 
    updateApplicationStage: moveJob, 
    deleteApplication: removeJob,
    loading 
  } = useApplicationStore();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getJobsByStage = (stage: Stage) => jobs.filter(j => j.stage === stage);

  const handleDragStart = (jobId: string) => setDraggingId(jobId);
  const handleDragEnd = () => { setDraggingId(null); setDragOverStage(null); };

  const handleDrop = (stage: Stage) => {
    if (draggingId) moveJob(draggingId, stage);
    setDragOverStage(null);
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-text-tertiary bg-surface border-border';
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };


  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 animate-in fade-in duration-500 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">Pipeline</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Track applications · Drag cards to update status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-text-muted">{jobs.length} total roles</p>
            <p className="text-[10px] text-text-tertiary">Auto-expire after 30 days</p>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-secondary transition-all shadow-sm shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            Add Roles
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {STAGES.map((stage) => {
          const stageJobs = getJobsByStage(stage.id);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage.id); }}
              onDrop={() => handleDrop(stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              className={`flex flex-col rounded-2xl border-2 transition-all duration-200 ${
                isOver 
                  ? `${stage.border} ${stage.bg} scale-[1.01]` 
                  : 'border-border bg-surface-hover'
              }`}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border-b ${isOver ? stage.border : 'border-border'}`}>
                <div className="flex items-center gap-2">
                  <stage.icon className={`w-4 h-4 ${stage.color}`} weight="fill" />
                  <span className="text-sm font-bold text-text-primary">{stage.label}</span>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${stage.bg} ${stage.color} ${stage.border}`}>
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 min-h-[200px] overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {stageJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                      onDragEnd={handleDragEnd}
                      whileDrag={{ 
                        rotate: 1.5, 
                        scale: 1.03,
                        zIndex: 100,
                        boxShadow: '0 16px 40px rgba(0,0,0,0.12)'
                      }}
                      className="bg-surface border border-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing select-none group"
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 bg-surface-hover border border-border rounded-lg flex items-center justify-center shrink-0">
                            <BuildingOffice className="w-4 h-4 text-text-tertiary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate leading-tight">{job.title}</p>
                            <p className="text-[11px] text-text-muted font-medium truncate">{job.company}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeJob(job.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.matchScore && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getScoreColor(job.matchScore)}`}>
                            {job.matchScore}% match
                          </span>
                        )}
                        {job.appliedDate && (
                          <span className="text-[10px] text-text-tertiary font-medium">
                            Applied {job.appliedDate}
                          </span>
                        )}
                        {job.expiresIn !== undefined && (
                          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${job.expiresIn <= 7 ? 'text-amber-600' : 'text-text-tertiary'}`}>
                            <Hourglass className="w-2.5 h-2.5" weight="fill" />
                            {job.expiresIn}d
                          </span>
                        )}
                      </div>

                      {/* Stage-move quick actions (on hover) */}
                      <div className="mt-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {STAGES.filter(s => s.id !== job.stage).map(s => (
                          <button
                            key={s.id}
                            onClick={() => moveJob(job.id, s.id)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${s.bg} ${s.color} ${s.border} hover:opacity-80 transition-opacity`}
                          >
                            → {s.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Drop zone hint */}
                {isOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-2 border-dashed ${stage.border} rounded-xl h-16 flex items-center justify-center`}
                  >
                    <p className={`text-xs font-bold ${stage.color}`}>Drop here</p>
                  </motion.div>
                )}

                {/* Empty state */}
                {stageJobs.length === 0 && !isOver && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <stage.icon className={`w-8 h-8 ${stage.color} opacity-30 mb-2`} />
                    <p className="text-xs text-text-tertiary">No {stage.label.toLowerCase()} roles</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom summary bar */}
      <div className="flex items-center gap-6 px-4 py-3 bg-surface border border-border rounded-xl text-xs text-text-muted">
        {STAGES.map(s => {
          const count = getJobsByStage(s.id).length;
          return (
            <div key={s.id} className="flex items-center gap-1.5">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} weight="fill" />
              <span className="font-semibold">{count}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 text-text-tertiary">
          <Hourglass className="w-3.5 h-3.5" />
          Saved jobs auto-expire after 30 days
        </div>
      </div>
    </div>
  );
}
