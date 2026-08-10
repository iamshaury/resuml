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
  Circle,
  Briefcase
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";
import UserMenu from "./UserMenu";

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
      name: "Applications", 
      path: "/applications", 
      icon: Briefcase,
      desc: "Application tracker"
    },
  ];

  return (
    <div className="w-64 h-screen bg-bg border-r-2 border-border/60 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/40 -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-white font-black text-lg tracking-tight">R</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-text-primary">resuml</span>
        </Link>
      </div>

      {/* Three Pillars */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-2 mb-4 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Workspace</p>
        {pillars.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? "bg-accent text-white shadow-xl shadow-accent/30 scale-[1.02]" 
                  : "text-text-muted hover:bg-surface hover:text-text-primary hover:scale-[1.02]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 bg-accent rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <item.icon 
                className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-text-muted group-hover:text-accent transition-colors"}`} 
                weight={isActive ? "fill" : "bold"} 
              />
              <div className="flex-1 min-w-0">
                <span className={`text-[15px] font-bold block ${isActive ? "text-white" : ""}`}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Extension Status Widget */}
      <div className="mx-4 mb-4 p-4 bg-surface border-2 border-border/50 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <PlugsConnected className={`w-5 h-5 ${extConnected ? "text-emerald-500" : "text-text-tertiary"}`} weight="bold" />
          <span className="text-xs font-black text-text-primary">Extension</span>
          <span className={`ml-auto text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full ${
            extConnected ? "bg-emerald-100 text-emerald-700" : "bg-bg text-text-tertiary"
          }`}>
            {extConnected ? "Live" : "Off"}
          </span>
        </div>
        <a 
          href="https://chrome.google.com/webstore" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center py-2 bg-accent-light text-accent rounded-xl text-[11px] font-black hover:bg-accent hover:text-white transition-colors"
        >
          Install Now
        </a>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t-2 border-border/60 bg-surface">
        <UserMenu />
      </div>
    </div>
  );
}
