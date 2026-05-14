"use client";

import React from 'react';
import { MagnifyingGlass, MapPin, Sparkle, Target, List } from '@phosphor-icons/react';
import { SearchMode } from '@/app/dashboard/page';

interface SearchSectionProps {
  query: string;
  setQuery: (q: string) => void;
  location: string;
  setLocation: (l: string) => void;
  onSearch: (e: React.FormEvent) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
}

export default function SearchSection({
  query,
  setQuery,
  location,
  setLocation,
  onSearch,
  searchMode,
  setSearchMode
}: SearchSectionProps) {
  return (
    <div className="flex flex-col gap-4 h-full p-2">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-surface rounded-2xl w-fit">
        <button
          onClick={() => setSearchMode('semantic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-bold transition-all ${
            searchMode === 'semantic' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Sparkle weight={searchMode === 'semantic' ? "fill" : "bold"} className={searchMode === 'semantic' ? "text-accent" : ""} />
          Semantic
        </button>
        <button
          onClick={() => setSearchMode('matchmaking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-bold transition-all ${
            searchMode === 'matchmaking' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Target weight={searchMode === 'matchmaking' ? "fill" : "bold"} className={searchMode === 'matchmaking' ? "text-accent" : ""} />
          Match Profile
        </button>
        <button
          onClick={() => setSearchMode('standard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-bold transition-all ${
            searchMode === 'standard' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <List weight={searchMode === 'standard' ? "fill" : "bold"} className={searchMode === 'standard' ? "text-accent" : ""} />
          Standard
        </button>
      </div>

      <form onSubmit={onSearch} className="flex flex-col xl:flex-row items-center gap-3 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <div className="relative flex-1 group w-full bg-surface hover:bg-surface-hover transition-colors rounded-[1.25rem] border border-transparent focus-within:border-border focus-within:bg-white">
            <MagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-text-primary transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={searchMode === 'matchmaking'}
              placeholder={searchMode === 'matchmaking' ? "Autopilot: Finding matches based on your active resume..." : "Role, skills, or 'How to become a Sr Dev?'"}
              className="w-full bg-transparent px-14 py-5 rounded-[1.25rem] outline-none text-text-primary placeholder:text-text-tertiary font-medium disabled:opacity-50"
            />
          </div>
          
          <div className="relative w-full md:w-64 group bg-surface hover:bg-surface-hover transition-colors rounded-[1.25rem] border border-transparent focus-within:border-border focus-within:bg-white">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-text-primary transition-colors" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full bg-transparent px-14 py-5 rounded-[1.25rem] outline-none text-text-primary placeholder:text-text-tertiary font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full xl:w-auto shrink-0 bg-accent text-white px-8 py-5 rounded-[1.25rem] font-bold hover:bg-accent-secondary hover:shadow-xl hover:shadow-accent/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {searchMode === 'matchmaking' ? 'Scan & Match' : 'Search Jobs'}
        </button>
      </form>
    </div>
  );
}
