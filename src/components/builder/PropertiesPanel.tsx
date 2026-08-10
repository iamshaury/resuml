"use client";

import React, { useState, useEffect } from 'react';
import { 
  TextAlignLeft, TextAlignRight, TextAlignCenter, TextAlignJustify,
  TextB, TextItalic, TextUnderline, Plus, CaretLeft, CaretRight,
  Lightning, Sparkle, CheckCircle, Warning
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertiesPanelProps {
  isTailoring?: boolean;
  jobId?: string | null;
  data?: any;
  onApply?: (name: string, value: string) => void;
}

export default function PropertiesPanel({ isTailoring, jobId, data, onApply }: PropertiesPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [applied, setApplied] = useState<string[]>([]);

  useEffect(() => {
    if (isTailoring && jobId) {
      // Simulate analysis on mount if tailoring
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setSuggestions([
          {
            id: 'summary',
            fieldKey: 'summary',
            title: 'Optimize Summary',
            description: 'Aligns your summary with the "Senior" and "Leadership" keywords found in the job description.',
            optimizedText: 'Senior Full Stack Engineer with a proven track record of leading cross-functional teams to deliver scalable web applications. Expert in React, Node.js, and cloud architecture, with a strong focus on performance and developer experience.'
          },
          {
            id: 'skills',
            fieldKey: 'skills',
            title: 'Add Missing Skills',
            description: 'The job requires GraphQL and AWS, which are missing from your core competencies.',
            optimizedText: data?.skills ? `${data.skills}, GraphQL, AWS, System Design` : 'GraphQL, AWS, System Design'
          }
        ]);
      }, 2500);
    }
  }, [isTailoring, jobId]);

  const handleApply = (id: string, fieldKey: string, text: string) => {
    if (onApply && data) {
      onApply(fieldKey, text);
      setApplied([...applied, id]);
    }
  };

  return (
    <div className="w-[320px] shrink-0 bg-surface border-l border-border flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {/* AI Tailoring Active Panel */}
      {isTailoring && (
        <div className="shrink-0 p-6 border-b border-border bg-surface-hover/30 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-text-primary text-surface flex items-center justify-center shrink-0 shadow-md shadow-black/5">
              <Sparkle weight="fill" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-sm">AI Tailor Active</h3>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Job Vector Matching</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-border" />
                  <div className="absolute inset-0 rounded-full border-2 border-text-primary border-t-transparent animate-spin" />
                  <Sparkle weight="duotone" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary w-5 h-5 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-text-primary">Analyzing Job Requirements...</p>
                <p className="text-[10px] text-text-muted mt-1 leading-relaxed max-w-[200px]">Cross-referencing your semantic DNA with the target role</p>
              </motion.div>
            ) : suggestions.length > 0 ? (
              <motion.div 
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-2">
                  <Warning className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" weight="fill" />
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                    We found structural gaps between your resume and this role. Apply these AI optimizations to increase your match score.
                  </p>
                </div>
                
                {suggestions.map((sug) => (
                  <motion.div 
                    layout
                    key={sug.id} 
                    className={`bg-white border rounded-2xl p-4 transition-all duration-300 ${
                      applied.includes(sug.id) ? 'border-emerald-200 shadow-sm shadow-emerald-100/50' : 'border-border shadow-sm shadow-black/5 hover:border-text-tertiary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className={`text-xs font-bold leading-tight ${applied.includes(sug.id) ? 'text-emerald-700' : 'text-text-primary'}`}>
                        {sug.title}
                      </h4>
                      {applied.includes(sug.id) && <CheckCircle weight="fill" className="text-emerald-500 w-4 h-4 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-text-muted mb-4 leading-relaxed">
                      {sug.description}
                    </p>
                    {!applied.includes(sug.id) ? (
                      <button 
                        onClick={() => handleApply(sug.id, sug.fieldKey, sug.optimizedText)}
                        className="w-full py-2 bg-text-primary text-surface text-[10px] font-bold rounded-xl hover:scale-[0.98] transition-transform active:scale-[0.95]"
                      >
                        Apply Optimization
                      </button>
                    ) : (
                      <div className="w-full py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                        <CheckCircle weight="bold" className="w-3 h-3" /> Applied successfully
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Properties */}
      <div className="shrink-0 p-6 space-y-8 pb-24">
      


      {/* Alignment */}
      <section>
        <h4 className="text-xs font-bold text-text-primary mb-3">Alignment</h4>
        <div className="flex p-1 bg-surface-hover rounded-xl border border-border">
          <button className="flex-1 py-2 flex items-center justify-center text-text-primary bg-white rounded-lg shadow-sm">
            <TextAlignLeft size={16} />
          </button>
          <button className="flex-1 py-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <TextAlignCenter size={16} />
          </button>
          <button className="flex-1 py-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <TextAlignRight size={16} />
          </button>
          <button className="flex-1 py-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <TextAlignJustify size={16} />
          </button>
        </div>
      </section>

      {/* Size */}
      <section>
        <h4 className="text-xs font-bold text-text-primary mb-3">Size</h4>
        <div className="flex gap-3">
          <div className="flex-1 bg-white border border-border rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs text-text-muted">W</span>
            <span className="text-xs font-bold">128</span>
            <span className="text-xs text-text-muted">px</span>
          </div>
          <div className="flex-1 bg-white border border-border rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs text-text-muted">H</span>
            <span className="text-xs font-bold">32</span>
            <span className="text-xs text-text-muted">px</span>
          </div>
        </div>
      </section>

      {/* Text Settings */}
      <section>
        <h4 className="text-xs font-bold text-text-primary mb-3">Text</h4>
        <div className="space-y-3">
          <select className="w-full bg-white border border-border rounded-xl p-3 text-xs font-bold outline-none cursor-pointer">
            <option>Geist</option>
            <option>Inter</option>
            <option>Satoshi</option>
          </select>
          <div className="flex gap-3">
            <select className="flex-1 bg-white border border-border rounded-xl p-3 text-xs font-bold outline-none cursor-pointer">
              <option>Regular</option>
              <option>Medium</option>
              <option>Bold</option>
            </select>
            <select className="w-[80px] bg-white border border-border rounded-xl p-3 text-xs font-bold outline-none cursor-pointer text-center">
              <option>14px</option>
              <option>16px</option>
            </select>
          </div>
          <div className="flex gap-3">
             <div className="flex-1 bg-white border border-border rounded-xl p-3 text-xs font-bold flex justify-between items-center">
               <span className="text-text-muted">A</span> Auto
             </div>
             <div className="flex-1 bg-white border border-border rounded-xl p-3 text-xs font-bold flex justify-between items-center">
               <span className="text-text-muted">A|</span> -1.5%
             </div>
          </div>
          <div className="flex p-1 bg-surface-hover rounded-xl border border-border">
            <button className="flex-1 py-2 flex items-center justify-center text-text-primary bg-white rounded-lg shadow-sm">
              <TextB size={16} />
            </button>
            <button className="flex-1 py-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
              <TextItalic size={16} />
            </button>
            <button className="flex-1 py-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
              <TextUnderline size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h4 className="text-xs font-bold text-text-primary mb-3">Colors</h4>
        <div className="w-full bg-white border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#18181B]"></div>
          <span className="text-xs font-bold">#18181B</span>
        </div>
      </section>
      
      </div>
    </div>
  );
}
