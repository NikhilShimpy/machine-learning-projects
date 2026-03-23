"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ToastContainer } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {children}
      <ToastContainer />
    </div>
  );
}
