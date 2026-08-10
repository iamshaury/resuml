"use client";

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { motion } from 'framer-motion';
import { UserCircle, MapPin, EnvelopeSimple, Phone, Globe, PencilSimple, Briefcase, GraduationCap, Code } from '@phosphor-icons/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { formData } = useResumeStore();

  const skillsList = formData.skills 
    ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) 
    : [];

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-primary leading-none mb-3">
            Your Profile
          </h1>
          <p className="text-text-muted text-lg">
            Your semantic professional DNA
          </p>
        </div>
        <Link 
          href="/profile/setup"
          className="flex items-center gap-2 bg-text-primary text-surface px-6 py-3.5 rounded-2xl text-sm font-bold hover:scale-[0.98] transition-transform shadow-sm w-fit"
        >
          <PencilSimple weight="bold" className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Core Info */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-24 h-24 bg-surface-hover rounded-full border border-border flex items-center justify-center text-text-tertiary mb-5">
              <UserCircle className="w-12 h-12" weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-1">{formData.name || "Anonymous User"}</h2>
            <p className="text-text-muted font-medium mb-8 text-sm">{formData.desiredRoles || formData.experienceLevel || "Professional"}</p>
            
            <div className="w-full flex flex-col gap-4 text-left">
              {formData.email && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-8 h-8 rounded-xl bg-surface-hover border border-border flex items-center justify-center shrink-0">
                    <EnvelopeSimple className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <span className="truncate">{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-8 h-8 rounded-xl bg-surface-hover border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <span className="truncate">{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-8 h-8 rounded-xl bg-surface-hover border border-border flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <span className="truncate">{formData.location}</span>
                </div>
              )}
              {formData.website && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="w-8 h-8 rounded-xl bg-surface-hover border border-border flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-text-primary font-medium">{formData.website}</a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Skills Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="bg-surface border border-border rounded-3xl p-8"
          >
            <h3 className="text-lg font-bold text-text-primary tracking-tight mb-5">Core Competencies</h3>
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-surface-hover border border-border text-text-primary text-xs font-bold rounded-full transition-colors hover:border-text-tertiary/40 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">No skills added yet.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column - Experience, Summary, Education */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="bg-surface border border-border rounded-3xl p-8"
          >
            <h3 className="text-lg font-bold text-text-primary tracking-tight mb-4">Professional Summary</h3>
            <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
              {formData.summary || "No summary provided. Edit your profile to add one."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
              className="bg-surface border border-border rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-surface-hover border border-border flex items-center justify-center text-text-tertiary shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Experience</h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                {formData.experience || "No experience listed."}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
              className="bg-surface border border-border rounded-3xl p-8 flex flex-col gap-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-surface-hover border border-border flex items-center justify-center text-text-tertiary shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">Education</h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                  {formData.education || "No education listed."}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-surface-hover border border-border flex items-center justify-center text-text-tertiary shrink-0">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">Projects</h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                  {formData.projects || "No projects listed."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
