"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Shield,
  BarChart3,
  Settings,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  LogOut,
  Home,
  Building,
  Mail,
  LifeBuoy,
  Wifi,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import GlitchText from "@/components/glitch-text";
import { useUser } from "@stackframe/stack";
import { useLogout } from "@/lib/auth-utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const userTeams = user?.useTeams() || [];
  const currentTeam = userTeams[0] || null;
  const [isAdmin, setIsAdmin] = React.useState(false);
  const logout = useLogout();

  React.useEffect(() => {
    async function checkAdminStatus() {
      if (!user || !currentTeam) {
        setIsAdmin(false);
        return;
      }

      try {
        const permissions = await user.listPermissions(currentTeam);
        const hasAdminPermission = permissions.some(permission => permission.id === 'team_admin');
        setIsAdmin(hasAdminPermission);
      } catch (error) {
        console.warn("Error checking admin status:", error);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [user, currentTeam]);

  const data = {
    navMain: [
      {
        title: "Overview",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
          },
          {
            title: "Live Surveillance",
            url: "/dashboard/surveillance",
            icon: Camera,
          },
          {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Security",
        items: [
          {
            title: "Threat Detection",
            url: "/dashboard/threats",
            icon: Shield,
          },
          {
            title: "Alerts",
            url: "/dashboard/alerts",
            icon: AlertTriangle,
          },
          {
            title: "Activity Log",
            url: "/dashboard/activity",
            icon: Activity,
          },
        ],
      },
      {
        title: "Tickets",
        items: [
          {
            title: "All Tickets",
            url: "/dashboard/tickets",
            icon: LifeBuoy,
          },
          {
            title: "Create Ticket",
            url: "/dashboard/tickets/create",
            icon: FileText,
          },
        ],
      },
      {
        title: "Internet",
        items: [
          {
            title: "Network Dashboard",
            url: "/dashboard/internet",
            icon: Wifi,
          },
        ],
      },
      {
        title: "Management",
        items: [
          {
            title: "Teams",
            url: "/dashboard/teams",
            icon: Building,
          },
          // Only show Invite Members for team admins
          ...(isAdmin ? [{
            title: "Invite Members",
            url: "/dashboard/teams/invite",
            icon: Mail,
          }] : []),
          {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
          },
          {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-2">
          <Image 
            src="/vaktros.svg" 
            alt="Vaktros Logo" 
            width={24} 
            height={24} 
            className="text-red-500" 
          />
          <GlitchText className="text-lg font-bold tracking-wider">
            VAKTROS
          </GlitchText>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-red-400/80 font-semibold">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className="hover:bg-red-500/10 hover:text-red-400 data-[active=true]:bg-red-500/20 data-[active=true]:text-red-400"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 