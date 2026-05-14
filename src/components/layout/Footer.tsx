"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">Resuml</span>
            </Link>
            <p className="text-text-muted max-w-sm text-sm leading-relaxed">
              The next-gen job search copilot. We use AI vector embeddings to connect elite professionals with roles they actually want.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text-primary mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">Intelligence Feed</Link></li>
              <li><Link href="/builder" className="hover:text-accent transition-colors">Resume Builder</Link></li>
              <li><Link href="/matching" className="hover:text-accent transition-colors">Vector Matching</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text-primary mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Resuml AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>Powered by Gemini 1.5 Flash</span>
            <span>Made for the modern job market</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
