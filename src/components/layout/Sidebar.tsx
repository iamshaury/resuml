"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  SignOut,
  MagnifyingGlass,
  Kanban,
  PlugsConnected,
  ArrowSquareOut,
  Circle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [extConnected] = useState(false); // TODO: wire to Chrome Extension WS status

  const pillars = [
    { 
      name: "Builder", 
      path: "/builder", 
      icon: FileText,
      desc: "Live resume canvas"
    },
    { 
      name: "Matches", 
      path: "/dashboard", 
      icon: MagnifyingGlass,
      desc: "Semantic job feed"
    },
    { 
      name: "Pipeline", 
      path: "/pipeline", 
      icon: Kanban,
      desc: "Application tracker"
    },
  ];

  return (
    <div className="w-60 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shadow-sm shadow-accent/30">
            <span className="text-white font-black text-sm tracking-tight">R</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">resuml</span>
        </Link>
        <p className="text-[10px] text-text-tertiary mt-1 ml-9 font-medium tracking-wide uppercase">AI Copilot</p>
      </div>

      {/* Three Pillars */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        <p className="px-2 mb-2 text-[9px] font-bold uppercase tracking-widest text-text-tertiary">Workspace</p>
        {pillars.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                isActive 
                  ? "bg-accent text-white shadow-md shadow-accent/25" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 bg-accent rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon 
                className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-text-muted group-hover:text-accent transition-colors"}`} 
                weight={isActive ? "fill" : "regular"} 
              />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold block ${isActive ? "text-white" : ""}`}>{item.name}</span>
                <span className={`text-[10px] block truncate ${isActive ? "text-white/60" : "text-text-tertiary"}`}>{item.desc}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Extension Status Widget */}
      <div className="mx-3 mb-3 p-3 bg-surface-hover border border-border rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <PlugsConnected className={`w-4 h-4 ${extConnected ? "text-emerald-500" : "text-text-tertiary"}`} weight="fill" />
          <span className="text-[11px] font-bold text-text-primary">Chrome Extension</span>
          <span className={`ml-auto text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
            extConnected ? "bg-emerald-100 text-emerald-700" : "bg-surface border border-border text-text-tertiary"
          }`}>
            {extConnected ? "Live" : "Off"}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-tertiary">Jobs scraped today</span>
            <span className="font-bold text-text-primary">—</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-tertiary">Storage saved</span>
            <span className="font-bold text-emerald-600">0 KB</span>
          </div>
        </div>
        <a 
          href="https://chrome.google.com/webstore" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-[10px] text-accent font-bold hover:underline"
        >
          Install Extension <ArrowSquareOut className="w-3 h-3" />
        </a>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-all group">
          <SignOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
