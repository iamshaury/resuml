"use client";

import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import UserMenu from "./UserMenu";

export default function TopBar() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search commands or data..."
            className="w-full bg-surface border border-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-text-muted hover:bg-surface rounded-lg transition-all relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-px h-6 bg-border mx-2" />
        <UserMenu />
      </div>
    </header>
  );
}
