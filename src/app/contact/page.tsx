"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen relative pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
      <div className="mb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Direct Line.</h1>
        <p className="text-text-muted text-xl max-w-2xl font-light">
          For support, enterprise inquiries, or API access.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-16 md:gap-24">
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex-1"
        >
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-text-muted">Name</label>
              <input 
                type="text" 
                id="name"
                className="w-full bg-surface/30 border border-border/50 px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-text-muted">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full bg-surface/30 border border-border/50 px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="inquiry" className="text-sm text-text-muted">Inquiry Type</label>
              <select 
                id="inquiry"
                className="w-full bg-surface/30 border border-border/50 px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="support" className="bg-bg">Support</option>
                <option value="enterprise" className="bg-bg">Enterprise</option>
                <option value="api" className="bg-bg">API Access</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm text-text-muted">Message</label>
              <textarea 
                id="message"
                rows={5}
                className="w-full bg-surface/30 border border-border/50 px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button 
              type="submit"
              className="bg-text-primary text-bg py-4 font-medium hover:bg-accent hover:text-bg transition-colors mt-4"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          className="w-full md:w-80 flex flex-col gap-12"
        >
          <div>
            <h3 className="font-serif text-2xl mb-4 text-text-primary">Contact Details</h3>
            <a href="mailto:hello@resuml.com" className="text-text-muted hover:text-accent transition-colors">
              hello@resuml.com
            </a>
          </div>

          <div className="p-6 border border-border/50 bg-surface/30 flex flex-col gap-4">
            <h4 className="text-sm text-text-muted">System Status</h4>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="monolabel text-emerald-500">API: Operational</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="monolabel text-emerald-500">pgvector: Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
