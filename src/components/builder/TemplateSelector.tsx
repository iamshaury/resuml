"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ResumeTemplate } from '@/store/useResumeStore';

interface TemplateSelectorProps {
  current: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
  onClose: () => void;
}

const templates: { id: ResumeTemplate; name: string; description: string; icon: string }[] = [
  {
    id: 'modern',
    name: 'The Modern',
    description: 'Clean, two-column layout with bold accents. Perfect for tech and design.',
    icon: '🎯'
  },
  {
    id: 'minimal',
    name: 'The Minimalist',
    description: 'Ultra-clean, single-column focus. Best for clarity and high readability.',
    icon: '🌑'
  },
  {
    id: 'executive',
    name: 'The Executive',
    description: 'Traditional, serif-based elegance. Designed for leadership and finance.',
    icon: '🏛️'
  }
];

export default function TemplateSelector({ current, onSelect, onClose }: TemplateSelectorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="template-gallery-overlay"
    >
      <div className="template-gallery-content">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-serif text-3xl mb-2 text-text-primary">The Architecture Gallery</h2>
            <p className="text-text-muted text-sm font-light">Select a foundation that reflects your professional brand.</p>
          </div>
          <button onClick={onClose} className="tool-button border-none text-2xl hover:text-accent transition-colors">
            &times;
          </button>
        </header>

        <div className="template-grid">
          {templates.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -8 }}
              onClick={() => {
                onSelect(t.id);
                onClose();
              }}
              className={`template-card group ${current === t.id ? 'active' : ''}`}
            >
              <div className="template-card-preview border border-border/30 group-hover:border-accent/30 transition-colors">
                <div className={`mini-resume mini-${t.id}`}>
                  <div className="mini-header" />
                  <div className="mini-body p-4 flex flex-col gap-2">
                    <div className="mini-line bg-slate-200" />
                    <div className="mini-line w-2/3 bg-slate-200" />
                    <div className="mini-line bg-slate-200" />
                  </div>
                </div>
              </div>
              <div className="template-card-info">
                <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{t.name}</h3>
                <p className="text-text-muted text-xs leading-relaxed font-light">{t.description}</p>
                <div className="mt-4 monolabel text-[10px] text-accent/0 group-hover:text-accent transition-all duration-300">
                  SELECT AESTHETIC &rarr;
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
