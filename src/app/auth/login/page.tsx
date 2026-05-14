"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleLogo, GithubLogo, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) setErrorMsg(decodeURIComponent(error));
  }, []);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-all group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-border p-12 rounded-[3rem] shadow-2xl shadow-accent/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-2">Welcome Back</h1>
          <p className="text-text-muted">Sign in to manage your intelligence feed.</p>
        </div>

        <div className="space-y-4">
          {errorMsg && (
            <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center font-medium animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-border py-4 rounded-2xl font-bold text-text-primary hover:bg-surface transition-all active:scale-95"
          >
            <GoogleLogo className="w-6 h-6 text-[#4285F4]" weight="bold" />
            Continue with Google
          </button>
          
          <button 
            className="w-full flex items-center justify-center gap-3 bg-text-primary py-4 rounded-2xl font-bold text-white hover:bg-black transition-all active:scale-95"
          >
            <GithubLogo className="w-6 h-6" weight="fill" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-sm text-text-muted">
            New to Resuml? <Link href="/dashboard" className="text-accent font-bold hover:underline">Get started for free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
