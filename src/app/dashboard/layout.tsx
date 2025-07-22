import { stackServerApp } from "@/stack";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeaderProvider } from "@/components/dashboard-header-context";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect the entire dashboard - redirect if not authenticated
  const user = await stackServerApp.getUser({ or: "redirect" });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeaderProvider>
          <DashboardHeader userName={user.displayName || user.primaryEmail || 'User'} />
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </DashboardHeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  );
} 