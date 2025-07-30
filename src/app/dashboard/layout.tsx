"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeaderProvider } from "@/components/dashboard-header-context";
import { DashboardHeader } from "@/components/dashboard-header";
import { Suspense, useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

// Fallback component for when layout fails to load
function DashboardFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

// Client-only wrapper to ensure no server-side rendering
function ClientOnlyDashboard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side authentication check
  useEffect(() => {
    if (mounted && user === null) {
      // User is not authenticated, redirect to sign-in
      router.push('/handler/sign-in');
    }
  }, [mounted, user, router]);

  // Don't render anything until mounted (client-side only)
  if (!mounted) {
    return <DashboardFallback />;
  }

  // Show loading while checking authentication
  if (user === undefined) {
    return <DashboardFallback />;
  }

  // If user is null, we're redirecting, so show loading
  if (user === null) {
    return <DashboardFallback />;
  }

  // User is authenticated, render the dashboard
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeaderProvider>
          <DashboardHeader />
          <Suspense fallback={<DashboardFallback />}>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </div>
          </Suspense>
        </DashboardHeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientOnlyDashboard>{children}</ClientOnlyDashboard>;
} 