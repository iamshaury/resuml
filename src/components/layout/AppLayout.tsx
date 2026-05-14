"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname !== "/" && !pathname.startsWith("/pricing") && !pathname.startsWith("/auth") && !pathname.startsWith("/builder") && !pathname.startsWith("/profile/setup");
  const isBuilderRoute = pathname.startsWith("/builder") || pathname.startsWith("/profile/setup");

  if (isBuilderRoute) {
    return <>{children}</>;
  }

  if (!isAppRoute) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
