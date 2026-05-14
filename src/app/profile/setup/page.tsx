"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, User, Briefcase, Star, Target } from '@phosphor-icons/react';

const steps = [
  { id: 'name', title: 'Basic Info', icon: User },
  { id: 'roles', title: 'Desired Roles', icon: Target },
  { id: 'skills', title: 'Core Skills', icon: Star },
  { id: 'experience', title: 'Experience Level', icon: Briefcase },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { formData, setFormData, setResumeVector } = useResumeStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create a combined string of the user's profile to generate a vector embedding
      const profileText = `${formData.name}. Roles: ${formData.desiredRoles}. Skills: ${formData.skills}. Experience Level: ${formData.experienceLevel}.`;
      
      const res = await fetch('/api/profile/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: profileText,
          profileData: {
            desiredRoles: formData.desiredRoles,
            skills: formData.skills,
            experienceLevel: formData.experienceLevel
          }
        })
      });
      
      const data = await res.json();
      
      // Save the vector back into our global store so the dashboard can use it if needed
      if (data.vector) {
        setResumeVector(data.vector);
      }
      
      // Phase 5: Redirect back to the dashboard, where the auto-match will be triggered
      router.push('/dashboard?mode=matchmaking');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      
      {/* Progress Header */}
      <div className="w-full max-w-2xl mb-12">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8 text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                idx <= currentStep ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border border-border text-text-muted'
              }`}>
                {idx < currentStep ? <CheckCircle weight="fill" size={20} /> : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                  idx < currentStep ? 'bg-accent' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white border border-border rounded-3xl shadow-xl shadow-black/5 p-10 overflow-hidden relative min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
                <CurrentIcon size={24} weight="duotone" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary">{steps[currentStep].title}</h2>
            </div>

            {currentStep === 0 && (
              <div className="space-y-6">
                <p className="text-text-muted text-lg">Let's start with your name. What should we call you?</p>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full text-2xl font-bold text-text-primary placeholder:text-text-tertiary bg-transparent border-b-2 border-border focus:border-accent outline-none py-4 transition-colors"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <p className="text-text-muted text-lg">What kind of roles are you looking for?</p>
                <input 
                  type="text" 
                  value={formData.desiredRoles || ''}
                  onChange={(e) => setFormData({ desiredRoles: e.target.value })}
                  placeholder="e.g. Frontend Engineer, Full Stack Developer"
                  className="w-full text-xl font-bold text-text-primary placeholder:text-text-tertiary bg-transparent border-b-2 border-border focus:border-accent outline-none py-4 transition-colors"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-text-muted text-lg">List your core skills separated by commas.</p>
                <textarea 
                  value={formData.skills || ''}
                  onChange={(e) => setFormData({ skills: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, UI/UX"
                  className="w-full text-xl font-bold text-text-primary placeholder:text-text-tertiary bg-surface border border-border rounded-xl p-4 focus:border-accent outline-none min-h-[120px] resize-none transition-colors"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-text-muted text-lg">What is your current experience level?</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead / Staff'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ experienceLevel: level })}
                      className={`p-4 rounded-xl border text-left font-bold transition-all ${
                        formData.experienceLevel === level 
                          ? 'border-accent bg-accent-light text-accent ring-2 ring-accent/20' 
                          : 'border-border bg-surface text-text-primary hover:border-text-tertiary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-accent-secondary hover:-translate-y-1 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
            {!isSubmitting && <ArrowRight size={20} weight="bold" />}
          </button>
        </div>
      </div>
    </div>
  );
}
