"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import UserMenu from "./UserMenu";

export default function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="w-20 h-8 bg-surface animate-pulse rounded-xl" />;

  if (user) {
    return <UserMenu />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-sm font-semibold text-text-primary px-4 py-2 hover:bg-surface rounded-xl transition-all"
      >
        Sign In
      </Link>
      <Link
        href="/auth/login"
        className="text-sm font-bold bg-accent text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all"
      >
        Get Started
      </Link>
    </div>
  );
}
