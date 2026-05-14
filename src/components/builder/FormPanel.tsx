"use client";

import React, { useState } from 'react';
import { CaretDown, CaretUp, Plus } from '@phosphor-icons/react';
import { ResumeData } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeUpload from '@/components/builder/ResumeUpload';

interface FormPanelProps {
  data: ResumeData;
  onChange: (name: string, value: string) => void;
}

const AccordionItem = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode 
}) => {
  return (
    <div className="border-b border-border">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-sm font-bold text-text-primary hover:text-accent transition-colors"
      >
        {title}
        {isOpen ? <CaretUp size={16} /> : <Plus size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FormPanel({ data, onChange }: FormPanelProps) {
  const [openSection, setOpenSection] = useState<string | null>('summary');
  const [activeTab, setActiveTab] = useState<'builder' | 'templates'>('builder');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-[320px] shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {/* Tabs */}
      <div className="p-6 pb-2">
        <div className="flex p-1 bg-surface-hover rounded-xl border border-border">
          <button 
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'builder' 
                ? 'bg-white text-text-primary shadow-sm' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Builder
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'templates' 
                ? 'bg-white text-text-primary shadow-sm' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="mb-6">
          <ResumeUpload />
        </div>

        <AccordionItem 
          title="Professional Summary" 
          isOpen={openSection === 'summary'} 
          onToggle={() => toggleSection('summary')}
        >
          <textarea 
            name="summary" 
            value={data.summary} 
            onChange={handleChange} 
            placeholder="Write a brief summary of your professional experience here" 
            className="w-full bg-white border border-border rounded-xl p-4 text-xs text-text-primary resize-none outline-none focus:border-accent min-h-[100px] mb-3 transition-colors"
          />
          <button className="w-full bg-accent text-white py-3 rounded-xl text-xs font-bold hover:bg-accent-secondary transition-colors">
            Add my summary
          </button>
        </AccordionItem>

        <AccordionItem 
          title="Education" 
          isOpen={openSection === 'education'} 
          onToggle={() => toggleSection('education')}
        >
          <textarea 
            name="education" 
            value={data.education} 
            onChange={handleChange} 
            placeholder="Degree @ University..." 
            className="w-full bg-white border border-border rounded-xl p-4 text-xs text-text-primary resize-none outline-none focus:border-accent min-h-[100px] mb-3 transition-colors"
          />
          <button className="w-full bg-surface-hover text-text-primary border border-border py-3 rounded-xl text-xs font-bold hover:bg-white transition-colors">
            Add Education
          </button>
        </AccordionItem>

        <AccordionItem 
          title="Work Experience" 
          isOpen={openSection === 'experience'} 
          onToggle={() => toggleSection('experience')}
        >
          <textarea 
            name="experience" 
            value={data.experience} 
            onChange={handleChange} 
            placeholder="Role @ Company..." 
            className="w-full bg-white border border-border rounded-xl p-4 text-xs text-text-primary resize-none outline-none focus:border-accent min-h-[100px] mb-3 transition-colors"
          />
          <button className="w-full bg-surface-hover text-text-primary border border-border py-3 rounded-xl text-xs font-bold hover:bg-white transition-colors">
            Add Experience
          </button>
        </AccordionItem>

        <AccordionItem 
          title="Organization Experience" 
          isOpen={openSection === 'projects'} 
          onToggle={() => toggleSection('projects')}
        >
          <textarea 
            name="projects" 
            value={data.projects} 
            onChange={handleChange} 
            placeholder="Key Contributions..." 
            className="w-full bg-white border border-border rounded-xl p-4 text-xs text-text-primary resize-none outline-none focus:border-accent min-h-[100px] mb-3 transition-colors"
          />
        </AccordionItem>

        <AccordionItem 
          title="Skills" 
          isOpen={openSection === 'skills'} 
          onToggle={() => toggleSection('skills')}
        >
          <textarea 
            name="skills" 
            value={data.skills} 
            onChange={handleChange} 
            placeholder="React, Next.js..." 
            className="w-full bg-white border border-border rounded-xl p-4 text-xs text-text-primary resize-none outline-none focus:border-accent min-h-[100px] mb-3 transition-colors"
          />
        </AccordionItem>
      </div>
    </div>
  );
}
