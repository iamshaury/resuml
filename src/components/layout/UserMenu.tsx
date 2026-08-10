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
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-accent/20 transition-all"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 group outline-none"
      >
        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-text-primary">{user.user_metadata?.full_name || user.email?.split('@')[0]}</div>
          <div className="text-[10px] text-text-muted">Free Plan</div>
        </div>
        <div className="w-9 h-9 overflow-hidden rounded-full border-2 border-accent/20 group-hover:border-accent transition-all relative">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
              <UserCircle className="w-6 h-6" weight="fill" />
            </div>
          )}
        </div>
        <CaretDown className={`w-3 h-3 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-2xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="text-sm font-bold text-text-primary truncate">{user.email}</div>
                <div className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-black">Member ID: {user.id.slice(0, 8)}</div>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-surface-hover transition-all"
                >
                  <User className="w-5 h-5 text-text-tertiary" />
                  My Profile
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <SignOut className="w-5 h-5" />
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
