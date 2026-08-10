"use client";

import { useEffect, useState } from "react";
import { UserCircle, SignOut, CaretDown, User } from "@phosphor-icons/react";
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <button 
        onClick={() => router.push("/auth/login")}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-2xl text-sm font-black hover:bg-accent-secondary hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/30"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 group outline-none"
      >
        <div className="w-10 h-10 overflow-hidden rounded-2xl bg-accent-light flex-shrink-0 border-2 border-accent/20 group-hover:border-accent group-hover:rotate-3 transition-all relative">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-accent">
              <UserCircle className="w-7 h-7" weight="fill" />
            </div>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-[13px] font-black text-text-primary truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</div>
          <div className="text-[10px] font-bold text-accent">Free Plan</div>
        </div>
        <CaretDown className={`w-4 h-4 text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} weight="bold" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 bottom-full mb-3 w-56 bg-surface border-2 border-border rounded-3xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-5 border-b-2 border-border/60 bg-bg">
                <div className="text-[13px] font-black text-text-primary truncate">{user.email}</div>
                <div className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-black">ID: {user.id.slice(0, 8)}</div>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-text-primary hover:bg-bg transition-all"
                >
                  <User className="w-5 h-5 text-accent" weight="bold" />
                  My Profile
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-danger hover:bg-danger-light transition-all"
                >
                  <SignOut className="w-5 h-5" weight="bold" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
