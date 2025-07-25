"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useDashboardHeader } from "./dashboard-header-context";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { title, subheading } = useDashboardHeader();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 backdrop-blur-sm px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
        {subheading && (
          <span className="text-sm text-muted-foreground hidden lg:inline truncate">
            {subheading}
          </span>
        )}
      </div>
      <div className="ml-auto hidden sm:block">
        <span className="text-sm text-muted-foreground">
          Welcome back, {userName}
        </span>
      </div>
    </header>
  );
} 