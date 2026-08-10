"use client";

import { Bell } from "@phosphor-icons/react";
import UserMenu from "./UserMenu";

export default function TopBar() {
  return (
    <header className="h-12 bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
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
