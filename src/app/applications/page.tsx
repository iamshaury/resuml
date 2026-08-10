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

const STAGES: { id: Stage; label: string; icon: any; color: string; bg: string; border: string; glow: string }[] = [
  { id: 'saved',     label: 'Saved',     icon: BookmarkSimple, color: 'text-violet-600',   bg: 'bg-violet-100',   border: 'border-violet-300', glow: 'shadow-violet-500/20' },
  { id: 'applied',   label: 'Applied',   icon: PaperPlaneTilt, color: 'text-blue-600',    bg: 'bg-blue-100',     border: 'border-blue-300',  glow: 'shadow-blue-500/20'  },
  { id: 'interview', label: 'Interview', icon: Handshake,      color: 'text-emerald-600', bg: 'bg-emerald-100',  border: 'border-emerald-300', glow: 'shadow-emerald-500/20' },
  { id: 'rejected',  label: 'Rejected',  icon: X,             color: 'text-rose-600',     bg: 'bg-rose-100',     border: 'border-rose-300',  glow: 'shadow-rose-500/20'   },
];

export default function ApplicationsTracker() {
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
    if (!score) return 'text-text-tertiary bg-surface border-border/50';
    if (score >= 90) return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (score >= 75) return 'text-amber-700 bg-amber-100 border-amber-300';
    return 'text-slate-600 bg-slate-100 border-slate-300';
  };


  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 animate-in fade-in duration-500 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary">App Tracker</h1>
          <p className="text-text-muted text-sm mt-1 font-bold">
            Drag and drop to update status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-text-primary">{jobs.length} roles</p>
            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">In Pipeline</p>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-2xl text-sm font-black hover:bg-accent-secondary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-accent/30"
          >
            <Plus className="w-5 h-5" weight="bold" />
            Add Roles
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
              className={`flex flex-col rounded-[24px] border backdrop-blur-xl transition-all duration-300 ${
                isOver 
                  ? `${stage.border} ${stage.bg} scale-[1.02] shadow-xl ${stage.glow}` 
                  : 'border-border bg-surface-hover/50 hover:bg-surface-hover/80'
              }`}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between px-5 py-5 border-b-2 ${isOver ? stage.border : 'border-border/60'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stage.bg} border-2 ${stage.border}`}>
                    <stage.icon className={`w-5 h-5 ${stage.color}`} weight="fill" />
                  </div>
                  <span className="text-[16px] font-black text-text-primary tracking-tight">{stage.label}</span>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-xl border-2 shadow-sm ${stage.bg} ${stage.color} ${stage.border}`}>
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
                      className="bg-white border-2 border-border/80 shadow-sm rounded-3xl p-5 cursor-grab active:cursor-grabbing select-none group hover:shadow-xl hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 bg-surface border-2 border-border/60 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                            {job.logo ? (
                              <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-1" />
                            ) : (
                              <BuildingOffice className="w-6 h-6 text-text-tertiary" weight="fill" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[16px] font-black text-text-primary truncate leading-tight tracking-tight">{job.title}</p>
                            <p className="text-[13px] text-text-muted font-bold truncate mt-1">{job.company}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeJob(job.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface border-2 border-border/50 text-text-tertiary hover:bg-rose-100 hover:border-rose-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100 shrink-0 shadow-sm"
                        >
                          <X className="w-4 h-4" weight="bold" />
                        </button>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.matchScore && (
                          <span className={`text-[12px] font-black px-2.5 py-1 rounded-lg border-2 ${getScoreColor(job.matchScore)} shadow-sm`}>
                            {job.matchScore}% Match
                          </span>
                        )}
                        {job.appliedDate && (
                          <span className="text-[12px] text-text-muted font-bold bg-surface-hover px-2.5 py-1 rounded-lg border-2 border-border/60">
                            Applied {job.appliedDate}
                          </span>
                        )}
                      </div>

                      {/* Stage-move quick actions (on hover) */}
                      <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {STAGES.filter(s => s.id !== job.stage).map(s => (
                          <button
                            key={s.id}
                            onClick={() => moveJob(job.id, s.id)}
                            className={`text-[10px] font-black px-2 py-1 rounded-lg border-2 ${s.bg} ${s.color} ${s.border} hover:scale-105 active:scale-95 transition-all shadow-sm`}
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
      <div className="flex items-center gap-6 px-5 py-4 bg-surface border-2 border-border/60 rounded-2xl text-[13px] font-bold text-text-muted shadow-sm">
        {STAGES.map(s => {
          const count = getJobsByStage(s.id).length;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <s.icon className={`w-4 h-4 ${s.color}`} weight="fill" />
              <span className="font-black">{count}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
