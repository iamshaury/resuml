"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  SignOut,
  Sparkle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Intelligence Feed", path: "/dashboard", icon: Sparkle },
    { name: "My Resumes", path: "/builder", icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Resuml</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              }`}
            >
              <item.icon 
                className={`w-5 h-5 ${isActive ? "text-white" : "text-text-muted group-hover:text-accent transition-colors"}`} 
                weight={isActive ? "fill" : "regular"} 
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <SignOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
