"use client";
import React, { useState, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Sparkle, CheckCircle } from '@phosphor-icons/react';

export default function ResumeUpload() {
  const { setFormData } = useResumeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File is too large (max 2MB). Resumes should be small!');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to parse resume');
      }

      const parsedData = await response.json();
      setFormData(parsedData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [setFormData]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative overflow-hidden group cursor-pointer border rounded-sm p-8 transition-all duration-500 flex flex-col items-center justify-center gap-4 ${isDragging ? 'border-accent bg-accent/5' : 'border-border/50 bg-surface/30 hover:border-accent/30'
          }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-16 h-16 rounded-sm bg-accent/10 flex items-center justify-center text-accent relative">
                <Sparkle size={32} weight="duotone" className="animate-pulse" />
                <div className="absolute inset-0 border border-accent border-t-transparent rounded-sm animate-spin" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-text-primary">AI is reading</h4>
                <p className="monolabel text-text-muted">Extracting your career data...</p>
              </div>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center gap-3 text-accent"
            >
              <CheckCircle size={64} weight="duotone" />
              <div>
                <h4 className="font-serif text-lg text-text-primary">Resume Loaded</h4>
                <p className="monolabel text-text-muted">Form has been auto-filled</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-16 h-16 rounded-sm bg-bg border border-border/50 flex items-center justify-center text-text-primary group-hover:text-accent group-hover:border-accent/30 transition-all duration-500">
                <Upload size={32} weight="duotone" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-text-primary">Import Resume</h4>
                <p className="monolabel text-text-muted">Drop PDF to auto-fill</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-900/10 border border-red-500/30 rounded-sm flex items-center gap-2 text-red-400 text-xs font-mono"
          >
            <X size={14} weight="bold" />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
