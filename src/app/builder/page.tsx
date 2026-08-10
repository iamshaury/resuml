"use client";

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import FormPanel from '@/components/builder/FormPanel';
import EditorCanvas from '@/components/builder/EditorCanvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import TemplateSelector from '@/components/builder/TemplateSelector';
import ResumePDF from '@/components/ResumePDF';
import { useResumeStore } from '@/store/useResumeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  SquaresFour, 
  MagicWand, 
  DownloadSimple, 
  ArrowLeft,
  ShareNetwork,
  ChartLineUp,
  Lock,
  Info
} from '@phosphor-icons/react';
import Link from 'next/link';

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

function BuilderContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('tailor');
  
  const [showGallery, setShowGallery] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  
  const { formData, setFormData, template, setTemplate } = useResumeStore();

  useEffect(() => {
    if (jobId) {
      setIsTailoring(true);
    }
  }, [jobId]);

  const handleDataChange = (name: string, value: string) => {
    setFormData({ [name]: value });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden text-text-primary">
      <AnimatePresence>
        {showGallery && (
          <TemplateSelector
            current={template}
            onSelect={setTemplate}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover border border-transparent hover:border-border transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">{formData.name ? `${formData.name}'s Resume` : 'Untitled Resume'}</span>
            <span className="text-[10px] text-text-muted">Builder · Last saved just now</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 cursor-help">
              <Lock size={12} weight="fill" />
              Zero-Storage Active
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-text-primary text-white text-[11px] rounded-xl px-3 py-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
              <p className="font-bold mb-1">🔒 Your Privacy is Protected</p>
              <p className="text-white/70 leading-relaxed">Your PDF was parsed in-memory and discarded. Nothing is stored on our servers. All data lives in your browser only.</p>
            </div>
          </div>

          <div className="w-px h-4 bg-border mx-1" />
          
          <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-xs font-bold hover:bg-surface-hover border border-transparent hover:border-border transition-colors text-text-muted">
            <ChartLineUp size={14} />
            Analyze
          </button>
          
          <PDFDownloadLink
            document={<ResumePDF data={formData} template={template} />}
            fileName={`${formData.name.replace(/\s+/g, '_') || 'resume'}.pdf`}
          >
            {/* @ts-ignore */}
            {({ loading }) => (
              <button disabled={loading} className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent-secondary transition-colors shadow-sm shadow-accent/20">
                <DownloadSimple size={14} weight="bold" />
                {loading ? 'Preparing...' : 'Export PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Form */}
        <FormPanel 
          data={formData} 
          onChange={handleDataChange} 
        />

        {/* Middle - Canvas */}
        <main className="flex-1 overflow-auto custom-scrollbar relative flex justify-center py-12 px-8">
          <div className="w-[850px] min-h-[1100px] shrink-0 bg-white shadow-xl shadow-black/5 rounded-sm border border-border/50 relative transform origin-top mx-auto">
            <EditorCanvas data={formData} template={template} onChange={handleDataChange} />
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <PropertiesPanel 
          isTailoring={isTailoring}
          jobId={jobId}
          data={formData}
          onApply={handleDataChange}
        />

      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background">Loading Builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
