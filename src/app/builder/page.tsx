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
import { AnimatePresence } from 'framer-motion';
import { 
  SquaresFour, 
  MagicWand, 
  DownloadSimple, 
  ArrowLeft,
  ShareNetwork,
  ChartLineUp
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
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover border border-transparent hover:border-border transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Frontend Engineer Resume</span>
            <span className="text-[10px] text-text-muted">Last edited just now</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-muted px-4">Draft</span>
          <div className="w-px h-4 bg-border mx-2"></div>
          
          <button className="h-9 px-4 flex items-center gap-2 rounded-lg text-xs font-bold hover:bg-surface-hover border border-transparent hover:border-border transition-colors">
            <ChartLineUp size={16} />
            Analyze
          </button>
          
          <PDFDownloadLink
            document={<ResumePDF data={formData} template={template} />}
            fileName={`${formData.name.replace(/\s+/g, '_') || 'resume'}.pdf`}
          >
            {/* @ts-ignore */}
            {({ loading }) => (
              <button disabled={loading} className="h-9 px-4 flex items-center gap-2 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent-secondary transition-colors shadow-sm shadow-accent/20">
                <DownloadSimple size={16} weight="bold" />
                {loading ? 'Wait...' : 'Export'}
              </button>
            )}
          </PDFDownloadLink>

          <button className="h-9 px-4 flex items-center gap-2 rounded-lg text-xs font-bold text-accent bg-accent-light hover:bg-accent/20 transition-colors border border-accent/10 ml-2">
            <ShareNetwork size={16} weight="bold" />
            Share
          </button>
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
        <PropertiesPanel />

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
