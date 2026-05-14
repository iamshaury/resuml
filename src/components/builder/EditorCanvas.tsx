"use client";

import React from 'react';
import { ResumeData, ResumeTemplate } from '@/store/useResumeStore';

interface EditorCanvasProps {
  data: ResumeData;
  template: ResumeTemplate;
  onChange: (name: string, value: string) => void;
}

export default function EditorCanvas({ data, template, onChange }: EditorCanvasProps) {
  const handleInput = (name: string) => (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText;
    onChange(name, value);
  };

  const renderSection = (title: string, field: keyof ResumeData, placeholder: string) => (
    <section className="mb-6">
      <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2 pb-1 border-b-[1.5px] border-text-primary/10">
        {title}
      </h3>
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput(field)}
        className="text-[12px] leading-relaxed text-text-primary/80 outline-none focus:bg-accent/5 focus:ring-1 focus:ring-accent/20 rounded-sm p-1 -ml-1 transition-all min-h-[1.5rem]"
      >
        {data[field] || placeholder}
      </div>
    </section>
  );

  return (
    <div className={`p-16 h-full w-full bg-white text-text-primary font-sans flex flex-col`}>
      {/* Header Section */}
      <header className="mb-8 flex flex-col items-center text-center">
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput('name')}
          className="text-4xl font-bold tracking-tight mb-3 outline-none focus:bg-accent/5 focus:ring-1 focus:ring-accent/20 rounded-sm px-2 py-1 transition-all"
        >
          {data.name || 'FULL NAME'}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-text-muted">
          <div contentEditable suppressContentEditableWarning onInput={handleInput('email')} className="outline-none focus:bg-accent/5 rounded-sm px-1 transition-colors">
            {data.email || 'email@example.com'}
          </div>
          <span className="opacity-30">•</span>
          {data.phone && (
             <>
                <div contentEditable suppressContentEditableWarning onInput={handleInput('phone')} className="outline-none focus:bg-accent/5 rounded-sm px-1 transition-colors">
                  {data.phone}
                </div>
                <span className="opacity-30">•</span>
             </>
          )}
          {data.location && (
            <div contentEditable suppressContentEditableWarning onInput={handleInput('location')} className="outline-none focus:bg-accent/5 rounded-sm px-1 transition-colors">
              {data.location}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {renderSection('Professional Summary', 'summary', 'A brief overview of your professional background...')}

      {/* Skills */}
      <section className="mb-6">
        <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-2 pb-1 border-b-[1.5px] border-text-primary/10">
          Core Competencies
        </h3>
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput('skills')}
          className="text-[12px] leading-relaxed text-text-primary/80 outline-none focus:bg-accent/5 focus:ring-1 focus:ring-accent/20 rounded-sm p-1 -ml-1 transition-all min-h-[1.5rem]"
        >
          {data.skills || 'React, Node.js, TypeScript, etc...'}
        </div>
      </section>

      {/* Experience */}
      {renderSection('Professional Experience', 'experience', 'Role @ Company (Date Range)...')}

      {/* Education */}
      {renderSection('Education', 'education', 'Degree @ University...')}

      {/* Projects */}
      {data.projects && renderSection('Key Projects', 'projects', 'Notable projects or achievements...')}
      
      <div className="mt-auto pt-8 border-t border-border flex justify-between items-center text-[9px] text-text-muted opacity-50 uppercase tracking-widest font-bold">
        <p>Resuml</p>
        <p>1536D-PRO</p>
      </div>
    </div>
  );
}
