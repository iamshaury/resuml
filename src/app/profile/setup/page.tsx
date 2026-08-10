"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Briefcase, 
  Star, 
  Target, 
  UploadSimple, 
  FilePdf, 
  FileDoc, 
  GithubLogo, 
  LinkedinLogo, 
  Trash, 
  Plus, 
  Sparkle, 
  MapPin, 
  CurrencyDollar, 
  HouseLine
} from '@phosphor-icons/react';

const STEPS = [
  { id: 'import', title: 'Import Profile', description: 'Upload your resume or connect social profiles' },
  { id: 'verify', title: 'Verify Data', description: 'Verify and refine your AI-extracted career history' },
  { id: 'preferences', title: 'Preferences', description: 'Configure your job search preferences' },
  { id: 'generating', title: 'AI Alignment', description: 'Mapping your skills to the job market' }
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { formData, setFormData, setResumeVector } = useResumeStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Verification field states (mirrors formData for easy local edit state)
  const [localSkills, setLocalSkills] = useState<string[]>(
    formData.skills 
      ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : []
  );
  const [newSkill, setNewSkill] = useState('');

  // Preference states
  const [desiredRoles, setDesiredRoles] = useState(formData.desiredRoles || '');
  const [workMode, setWorkMode] = useState<'remote' | 'hybrid' | 'onsite' | ''>('');
  const [targetLocation, setTargetLocation] = useState(formData.location || '');
  const [salaryExpectation, setSalaryExpectation] = useState('');

  // Process uploaded resume file
  const handleResumeUpload = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx');
    
    if (!isPdf && !isDocx) {
      setUploadError('Please upload a valid PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is too large (max 5MB).');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    const dataTransfer = new FormData();
    dataTransfer.append('file', file);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: dataTransfer,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to parse resume');
      }

      const parsedData = await response.json();
      
      // Update global Zustand state
      setFormData(parsedData);
      
      // Update local skills state for step 2 editing
      if (parsedData.skills) {
        setLocalSkills(
          parsedData.skills
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
        );
      }
      
      // Advance to verification step
      setCurrentStep(1);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateSocialConnect = (platform: 'github' | 'linkedin') => {
    setIsProcessing(true);
    setUploadError(null);
    
    setTimeout(() => {
      // Seed some high-quality parsing simulation data based on platform
      const mockData = platform === 'github' ? {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 019-2834',
        website: 'https://github.com/alexrivera',
        location: 'San Francisco, CA',
        summary: 'Passionate Full Stack Engineer specializing in React, TypeScript, Node.js, and cloud systems. Contributor to various open-source packages.',
        skills: 'React, TypeScript, Node.js, Next.js, GraphQL, PostgreSQL, Docker, AWS, Git, CI/CD',
        experience: 'Lead Software Engineer at TechCorp (2023 - Present) - Led a team of 4 engineers in migrating platform to Next.js, improving page performance by 40%.\nFull Stack Developer at WebFlow Solutions (2021 - 2023) - Maintained core microservices and built responsive frontend dashboards.',
        education: 'B.S. in Computer Science - University of California, Berkeley',
        projects: 'DevDeck: A developer dashboard built with Next.js and Tailwind CSS.\nSQLight: A lightweight database wrapper in Go.'
      } : {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 019-2834',
        website: 'https://linkedin.com/in/alex-rivera',
        location: 'San Francisco, CA',
        summary: 'Results-driven Senior Frontend Developer with 5+ years of experience designing and implementing scalable web applications. Expert in React and modern CSS systems.',
        skills: 'React, TypeScript, CSS Grid, Tailwind CSS, System Design, Product Strategy, Agile Methodologies, Figma',
        experience: 'Senior Frontend Engineer at DesignSystem Co (2022 - Present) - Created and maintained a unified company component library utilized by 30+ product pages.\nFrontend Engineer at StartupX (2020 - 2022) - Shipped MVP designs and established testing pipelines using Jest and Cypress.',
        education: 'B.S. in Software Engineering - San Jose State University',
        projects: 'Design System Kit: Open-source design system boilerplate.'
      };

      setFormData(mockData);
      setLocalSkills(mockData.skills.split(',').map(s => s.trim()));
      setIsProcessing(false);
      setCurrentStep(1);
    }, 1800);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleResumeUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleResumeUpload(file);
  };

  // Step 2 local edits handling
  const handleAddSkill = () => {
    if (newSkill.trim() && !localSkills.includes(newSkill.trim())) {
      const updated = [...localSkills, newSkill.trim()];
      setLocalSkills(updated);
      setFormData({ skills: updated.join(', ') });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = localSkills.filter(s => s !== skill);
    setLocalSkills(updated);
    setFormData({ skills: updated.join(', ') });
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData({ [key]: value });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Skills is already synced. Let's make sure desiredRoles has a sensible initial value
      if (!desiredRoles) {
        setDesiredRoles(formData.desiredRoles || '');
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Trigger alignment and embedding step
      setCurrentStep(3);
      generateEmbeddingAndPersist();
    }
  };

  const generateEmbeddingAndPersist = async () => {
    try {
      const combinedText = `${formData.name || ''}. Summary: ${formData.summary || ''}. Experience: ${formData.experience || ''}. Education: ${formData.education || ''}. Projects: ${formData.projects || ''}. Skills: ${localSkills.join(', ')}. Target Roles: ${desiredRoles}. Preferences: Mode ${workMode}, Location ${targetLocation}, Salary expectation ${salaryExpectation}.`;
      
      // Update form data state
      setFormData({
        desiredRoles,
        location: targetLocation,
        skills: localSkills.join(', ')
      });

      const res = await fetch('/api/profile/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: combinedText,
          profileData: {
            desiredRoles,
            skills: localSkills.join(', '),
            experienceLevel: formData.experienceLevel || 'Mid-Level'
          }
        })
      });

      if (!res.ok) throw new Error('Failed to vectorize profile');
      const data = await res.json();

      if (data.vector) {
        setResumeVector(data.vector);
      }

      // Briefly wait to let the success animation render
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Vector generation failed:', err);
      // Fallback redirect anyway so the dashboard functions
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1e293b] flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Progress Wizard */}
      <div className="w-full max-w-4xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={handleBack}
          disabled={currentStep === 3}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold disabled:opacity-30 self-start"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-1">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  idx <= currentStep 
                    ? 'bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/20' 
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {idx < currentStep ? <CheckCircle weight="fill" size={18} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold transition-all ${
                  idx === currentStep ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-6 md:w-12 h-[2px] mx-2 transition-all duration-300 ${
                  idx < currentStep ? 'bg-[#6366f1]' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100 p-6 md:p-10 min-h-[500px] flex flex-col animate-in fade-in duration-300">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: IMPORT PROFILE */}
          {currentStep === 0 && (
            <motion.div
              key="step-import"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-center animate-in fade-in duration-300"
            >
              <div className="text-center max-w-xl mx-auto mb-10 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#6366f1] flex items-center justify-center mx-auto mb-4">
                  <Sparkle size={24} weight="duotone" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-2">Build Your AI Profile</h2>
                <p className="text-slate-500 text-sm md:text-base">
                  Upload your resume or connect social accounts. Our parsing engine will construct a searchable career DNA for you in seconds.
                </p>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366f1] relative">
                    <Sparkle size={40} weight="duotone" className="animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 border-2 border-[#6366f1] border-t-transparent rounded-2xl animate-spin" />
                  </div>
                  <div className="text-center animate-pulse">
                    <h4 className="font-bold text-lg text-slate-900">Reading Resume Content...</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1">Extracting skills, roles, and credentials</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  
                  {/* File Upload zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative min-h-[250px] ${
                      isDragging 
                        ? 'border-[#6366f1] bg-indigo-50/30' 
                        : 'border-slate-200 hover:border-[#6366f1]/60 hover:bg-slate-50/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      accept=".pdf,.docx" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#6366f1] group-hover:border-indigo-100 transition-all duration-300 mb-4">
                      <UploadSimple size={28} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">Drag & Drop Resume</h3>
                    <p className="text-xs text-slate-400 mb-4">Supports PDF or DOCX up to 5MB</p>
                    <div className="flex gap-2 items-center text-slate-400 font-bold text-[10px] bg-slate-100 px-3 py-1 rounded-full">
                      <FilePdf size={14} className="text-red-500" /> PDF / <FileDoc size={14} className="text-blue-500" /> DOCX
                    </div>
                  </div>

                  {/* Connect socials & manual fallback */}
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Sync with Social Platforms</h4>
                      
                      <button
                        onClick={() => simulateSocialConnect('linkedin')}
                        className="w-full flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/10 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <LinkedinLogo size={22} weight="fill" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">LinkedIn Profile</p>
                            <p className="text-xs text-slate-400">Import your bio, experiences & skills</p>
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        onClick={() => simulateSocialConnect('github')}
                        className="w-full flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-slate-800 hover:bg-slate-50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                            <GithubLogo size={22} weight="fill" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">GitHub Profile</p>
                            <p className="text-xs text-slate-400">Extract tech stack and projects</p>
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">Don't have a file ready?</span>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-bold text-[#6366f1] hover:underline"
                      >
                        Fill manually from scratch →
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {uploadError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: VERIFICATION & EDITOR */}
          {currentStep === 1 && (
            <motion.div
              key="step-verify"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">Verify Parsed Profile</h2>
                <p className="text-slate-500 text-xs">Verify AI-parsed fields or add missing details before finalizing your search DNA.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 max-h-[500px] overflow-y-auto pr-1">
                
                {/* Contact & Bio Info */}
                <div className="space-y-4">
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={14} /> Contact Details
                    </h3>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#6366f1]"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Email</label>
                        <input 
                          type="email" 
                          value={formData.email || ''} 
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#6366f1]"
                          placeholder="e.g. john@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Location</label>
                        <input 
                          type="text" 
                          value={formData.location || ''} 
                          onChange={(e) => handleFormChange('location', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#6366f1]"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkle size={14} /> Professional Summary
                    </h3>
                    <textarea 
                      value={formData.summary || ''} 
                      onChange={(e) => handleFormChange('summary', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-[#6366f1] h-[120px] resize-none"
                      placeholder="Summarize your professional experience and ambitions..."
                    />
                  </div>
                </div>

                {/* Skills & Experience */}
                <div className="space-y-4">
                  {/* Skills Editor */}
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Star size={14} /> Core Tech Stack & Skills
                    </h3>
                    
                    <div className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add skill (e.g. TypeScript)"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#6366f1]"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-3 bg-[#6366f1] text-white rounded-lg flex items-center justify-center hover:bg-[#4f46e5]"
                      >
                        <Plus size={16} weight="bold" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-1 bg-white border border-slate-200 rounded-lg">
                      {localSkills.length === 0 ? (
                        <span className="text-xs text-slate-400 p-2 italic">No skills listed yet. Add some above.</span>
                      ) : (
                        localSkills.map(skill => (
                          <div 
                            key={skill} 
                            className="flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md border border-slate-200 font-mono"
                          >
                            <span>{skill}</span>
                            <button 
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Employment & Education Textareas */}
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Briefcase size={14} /> Professional Experience
                      </h3>
                      <textarea 
                        value={formData.experience || ''} 
                        onChange={(e) => handleFormChange('experience', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#6366f1] h-[80px] resize-none"
                        placeholder="Detailed work experience with dates and description..."
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User size={14} /> Projects & Education
                      </h3>
                      <textarea 
                        value={formData.projects || ''} 
                        onChange={(e) => handleFormChange('projects', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#6366f1] h-[70px] resize-none"
                        placeholder="Enter notable projects or education history..."
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Navigation Action */}
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#6366f1] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#4f46e5] hover:-translate-y-0.5 transition-all shadow-md shadow-[#6366f1]/20 text-sm"
                >
                  Confirm and Continue
                  <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREFERENCE CONFIGURATION */}
          {currentStep === 2 && (
            <motion.div
              key="step-preferences"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Career Preferences</h2>
                <p className="text-slate-500 text-xs">Help us filter down match results to align with your expectations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  
                  {/* Desired Roles */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1.5">
                      <Target size={16} className="text-[#6366f1]" /> Target Job Titles
                    </label>
                    <input 
                      type="text" 
                      value={desiredRoles}
                      onChange={(e) => setDesiredRoles(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6366f1] focus:bg-white transition-all font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Comma separated preferred titles</p>
                  </div>

                  {/* Work Mode */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1.5">
                      <HouseLine size={16} className="text-[#6366f1]" /> Workplace Preference
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'remote', label: 'Remote' },
                        { id: 'hybrid', label: 'Hybrid' },
                        { id: 'onsite', label: 'On-site' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setWorkMode(mode.id as any)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                            workMode === mode.id 
                              ? 'border-[#6366f1] bg-indigo-50/50 text-[#6366f1] shadow-sm' 
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Location preference */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#6366f1]" /> Target Location
                    </label>
                    <input 
                      type="text" 
                      value={targetLocation}
                      onChange={(e) => setTargetLocation(e.target.value)}
                      placeholder="e.g. Remote, or New York, NY"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6366f1] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Salary Expectation */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1.5">
                      <CurrencyDollar size={16} className="text-[#6366f1]" /> Salary Expectation
                    </label>
                    <input 
                      type="text" 
                      value={salaryExpectation}
                      onChange={(e) => setSalaryExpectation(e.target.value)}
                      placeholder="e.g. $120k/year or $90/hr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6366f1] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#6366f1] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#4f46e5] hover:-translate-y-0.5 transition-all shadow-md shadow-[#6366f1]/20 text-sm"
                >
                  Generate Search DNA
                  <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: VECTOR EMBEDDING & ALIGNMENT */}
          {currentStep === 3 && (
            <motion.div
              key="step-generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-24 h-24 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center text-[#6366f1] mb-6 relative shadow-inner">
                <Sparkle size={48} className="animate-spin text-[#6366f1]" style={{ animationDuration: '4s' }} weight="duotone" />
                <div className="absolute inset-0 border-[3px] border-[#6366f1] border-t-transparent rounded-3xl animate-spin" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2 animate-pulse">Running Semantic DNA Mapping...</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Gemini NLP is vectorizing your credentials to locate opportunities matching your exact skills and experience.
              </p>

              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-8 relative">
                <motion.div 
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="w-1/2 h-full bg-[#6366f1] absolute rounded-full"
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
