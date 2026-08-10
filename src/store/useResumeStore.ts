"use client";
import { create } from 'zustand';
import { supabase } from '@/utils/supabase';

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
  loading: boolean;
  dbSynced: boolean;
  setFormData: (data: Partial<ResumeData>) => void;
  setTemplate: (template: ResumeTemplate) => void;
  setResumeVector: (vector: number[]) => void;
  resetFormData: () => void;
  fetchProfile: () => Promise<void>;
  syncToDb: () => Promise<void>;
}

// Debounce timer for auto-saving
let saveTimeout: NodeJS.Timeout;

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
  (set, get) => ({
    formData: initialData,
    template: 'modern',
    resumeVector: null,
    loading: false,
    dbSynced: false,

    setFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data }
      }));
      // Trigger debounced save
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        get().syncToDb();
      }, 1000);
    },

    setTemplate: (template) => {
      set({ template });
      get().syncToDb();
    },

    setResumeVector: (vector) => {
      set({ resumeVector: vector });
      get().syncToDb();
    },

    resetFormData: () => {
      set({ formData: initialData, template: 'modern', resumeVector: null, dbSynced: false });
    },

    fetchProfile: async () => {
      set({ loading: true });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ loading: false, dbSynced: false });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Could not fetch profile (might not exist yet):', error.message);
          set({ loading: false, dbSynced: false });
          return;
        }

        if (data) {
          // Map DB columns back to formData
          const dbFormData: ResumeData = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            location: data.location || '',
            summary: data.summary || '',
            skills: data.skills || '',
            experience: data.experience || '',
            education: data.education || '',
            projects: data.projects || '',
            desiredRoles: data.desired_roles || '',
            experienceLevel: data.experience_level || '',
          };

          set({
            formData: dbFormData,
            resumeVector: data.vector || null,
            template: data.template || 'modern',
            dbSynced: true
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err.message);
      } finally {
        set({ loading: false });
      }
    },

    syncToDb: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const state = get();
        const fd = state.formData;

        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          name: fd.name,
          email: fd.email,
          phone: fd.phone,
          website: fd.website,
          location: fd.location,
          summary: fd.summary,
          skills: fd.skills,
          experience: fd.experience,
          education: fd.education,
          projects: fd.projects,
          desired_roles: fd.desiredRoles,
          experience_level: fd.experienceLevel,
          vector: state.resumeVector,
          template: state.template,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.warn('Could not sync profile to DB:', error.message);
        } else {
          set({ dbSynced: true });
        }
      } catch (err: any) {
        console.error('Error syncing profile:', err.message);
      }
    }
  })
);
