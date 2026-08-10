"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/utils/supabase';

export type Stage = 'saved' | 'applied' | 'interview' | 'rejected';

export interface PipelineJob {
  id: string; // UUID from DB or local string
  job_id?: string | number | null; // ID of the job from 'jobs' table
  title: string;
  company: string;
  stage: Stage;
  matchScore?: number;
  appliedDate?: string;
  expiresIn?: number;
  job_url?: string;
  logo?: string;
}

const SEED: PipelineJob[] = [];

interface ApplicationState {
  applications: PipelineJob[];
  loading: boolean;
  dbSynced: boolean;
  fetchApplications: () => Promise<void>;
  addApplication: (job: Omit<PipelineJob, 'id'> & { id?: string }) => Promise<void>;
  updateApplicationStage: (id: string, stage: Stage) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  setApplications: (jobs: PipelineJob[]) => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: SEED,
      loading: false,
      dbSynced: false,

      setApplications: (applications) => set({ applications }),

      fetchApplications: async () => {
        set({ loading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            // Not logged in, keep local state
            set({ loading: false, dbSynced: false });
            return;
          }

          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Could not fetch applications from Supabase (schema might not be setup yet):', error.message);
            set({ loading: false, dbSynced: false });
            return;
          }

          if (data) {
            const mappedJobs: PipelineJob[] = data.map((item: any) => ({
              id: item.id,
              job_id: item.job_id,
              title: item.title,
              company: item.company,
              stage: item.stage as Stage,
              matchScore: item.match_score || undefined,
              job_url: item.job_url || undefined,
              appliedDate: item.stage === 'applied' 
                ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : undefined,
              expiresIn: item.stage === 'saved' ? 30 - Math.floor((Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)) : undefined
            }));
            set({ applications: mappedJobs, dbSynced: true });
          }
        } catch (err: any) {
          console.error('Error fetching applications:', err.message);
        } finally {
          set({ loading: false });
        }
      },

      addApplication: async (job) => {
        const tempId = job.id || `local-${Math.random().toString(36).substr(2, 9)}`;
        const newJob: PipelineJob = {
          id: tempId,
          title: job.title,
          company: job.company,
          stage: job.stage || 'saved',
          matchScore: job.matchScore,
          job_url: job.job_url,
          logo: job.logo,
          appliedDate: job.stage === 'applied' ? 'Today' : undefined,
          expiresIn: job.stage === 'saved' ? 30 : undefined
        };

        // Update local state first
        set((state) => {
          // Prevent duplicates in local state
          const exists = state.applications.some(
            (item) => item.title === job.title && item.company === job.company
          );
          if (exists) return state;
          return { applications: [newJob, ...state.applications] };
        });

        // Sync with DB if logged in
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check if jobs table has matching job url to link
            let dbJobId: number | null = null;
            if (job.job_url) {
              const { data: dbJob } = await supabase
                .from('jobs')
                .select('id')
                .eq('job_url', job.job_url)
                .single();
              if (dbJob) dbJobId = dbJob.id;
            }

            const { data, error } = await supabase
              .from('applications')
              .insert({
                user_id: user.id,
                job_id: dbJobId,
                title: job.title,
                company: job.company,
                job_url: job.job_url,
                match_score: job.matchScore,
                stage: job.stage || 'saved'
              })
              .select()
              .single();

            if (error) {
              console.warn('Could not insert application to Supabase:', error.message);
            } else if (data) {
              // Update local item with real DB ID
              set((state) => ({
                applications: state.applications.map((item) => 
                  item.id === tempId ? { ...item, id: data.id, job_id: data.job_id } : item
                )
              }));
            }
          }
        } catch (err: any) {
          console.error('Error syncing added application:', err.message);
        }
      },

      updateApplicationStage: async (id, stage) => {
        // Update local state first
        set((state) => ({
          applications: state.applications.map((item) => 
            item.id === id 
              ? { 
                  ...item, 
                  stage, 
                  appliedDate: stage === 'applied' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
                  expiresIn: stage === 'saved' ? 30 : undefined
                } 
              : item
          )
        }));

        // Sync with DB if logged in
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !id.startsWith('local-') && !id.startsWith('seed-')) {
            const { error } = await supabase
              .from('applications')
              .update({ stage })
              .eq('id', id);

            if (error) {
              console.warn('Could not update application stage in Supabase:', error.message);
            }
          }
        } catch (err: any) {
          console.error('Error syncing updated stage:', err.message);
        }
      },

      deleteApplication: async (id) => {
        // Update local state first
        set((state) => ({
          applications: state.applications.filter((item) => item.id !== id)
        }));

        // Sync with DB if logged in
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !id.startsWith('local-') && !id.startsWith('seed-')) {
            const { error } = await supabase
              .from('applications')
              .delete()
              .eq('id', id);

            if (error) {
              console.warn('Could not delete application from Supabase:', error.message);
            }
          }
        } catch (err: any) {
          console.error('Error syncing deleted application:', err.message);
        }
      }
    }),
    {
      name: 'application-storage',
      partialize: (state) => ({ applications: state.applications }), // only persist applications array
    }
  )
);
