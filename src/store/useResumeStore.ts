"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
  desiredRoles?: string;
  experienceLevel?: string;
}

export type ResumeTemplate = 'modern' | 'minimal' | 'executive';

interface ResumeState {
  formData: ResumeData;
  template: ResumeTemplate;
  resumeVector: number[] | null;
  setFormData: (data: Partial<ResumeData>) => void;
  setTemplate: (template: ResumeTemplate) => void;
  setResumeVector: (vector: number[]) => void;
  resetFormData: () => void;
}

const initialData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  summary: '',
  skills: '',
  experience: '',
  education: '',
  projects: '',
  desiredRoles: '',
  experienceLevel: ''
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      formData: initialData,
      template: 'modern',
      resumeVector: null,
      setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      setTemplate: (template) => set({ template }),
      setResumeVector: (vector) => set({ resumeVector: vector }),
      resetFormData: () => set({ formData: initialData, template: 'modern', resumeVector: null }),
    }),
    {
      name: 'resume-storage', // name of item in the storage (must be unique)
    }
  )
);
