"use client";

import React from 'react';
import { 
  TextAlignLeft, TextAlignRight, TextAlignCenter, TextAlignJustify,
  TextB, TextItalic, TextUnderline, Plus, CaretLeft, CaretRight,
  Lightning
} from '@phosphor-icons/react';

export default function PropertiesPanel() {
  return (
    <div className="w-[320px] shrink-0 bg-surface border-l border-border flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
      
      {/* Skill Alignment Callout */}
      <div className="bg-accent-light rounded-2xl p-5 border border-accent/10">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Lightning weight="fill" />
          <h3 className="font-bold text-sm">Skill Alignment</h3>
        </div>
        <p className="text-xs text-text-muted mb-4 leading-relaxed">
          3 skills found in your profile that are not listed here.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-text-primary border border-border rounded-lg py-2 text-xs font-bold hover:bg-surface-hover transition-colors">
            Ignore
          </button>
          <button className="flex-1 bg-accent text-white rounded-lg py-2 text-xs font-bold hover:bg-accent-secondary transition-colors">
            Add skills
          </button>
        </div>
      </div>

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
  );
}
