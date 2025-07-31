"use client";

import { useDashboardHeader } from "@/components/dashboard-header-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
import { useLogout } from "@/lib/auth-utils";

interface DashboardHeaderProps {
  userName?: string; // Make optional since we'll use client-side data
}

export function DashboardHeader({ userName: serverUserName }: DashboardHeaderProps) {
  const { title, subheading } = useDashboardHeader();
  const router = useRouter();
  const user = useUser();
  const [mounted, setMounted] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const logout = useLogout();

  // Get display name from client-side user data, fallback to server prop
  const displayName = user?.displayName || user?.primaryEmail || serverUserName || 'User';

  // Prevent hydration mismatch by only showing client-dependent content after mount
  useEffect(() => {
    console.log('DashboardHeader: Component mounting...');
    setMounted(true);
    
    // Force a re-render after a short delay to handle auth redirect timing issues
    const timer = setTimeout(() => {
      console.log('DashboardHeader: Forcing re-render for auth state sync');
      setForceRender(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Additional effect to handle user state changes
  useEffect(() => {
    if (user) {
      console.log('DashboardHeader: User state updated, forcing re-render');
      setForceRender(prev => prev + 1);
    }
  }, [user]);

  // Debug logging to understand first sign-in issues
  useEffect(() => {
    console.log('DashboardHeader Debug:', {
      serverUserName,
      displayName,
      userExists: !!user,
      userDisplayName: user?.displayName,
      userEmail: user?.primaryEmail,
      mounted,
      forceRender,
      timestamp: new Date().toISOString()
    });
  }, [serverUserName, displayName, user, mounted, forceRender]);

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
  };

  const handleSignOut = async () => {
    await logout();
  };

  // Get user initials for avatar fallback with better error handling
  const getInitials = (name: string) => {
    if (!name || name.trim() === '') {
      return 'U'; // Default fallback
    }
    
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Ensure we always have a valid display name
  const initials = getInitials(displayName);

  // Log when we're about to render
  console.log('DashboardHeader: About to render with:', { displayName, initials, mounted });

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
      
      {/* Profile Avatar Dropdown - Always shows avatar, never welcome text */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10 focus:bg-white/10 transition-colors"
              aria-label="Profile menu"
            >
              <Avatar className="h-8 w-8">
                {/* Always show avatar - profile image only after mounted to prevent hydration mismatch */}
                <AvatarImage 
                  src={mounted && user?.profileImageUrl ? user.profileImageUrl : ''} 
                  alt={displayName}
                />
                {/* Always show fallback initials - this ensures avatar appears immediately */}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 bg-popover/95 backdrop-blur-sm border shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {mounted && user?.primaryEmail ? user.primaryEmail : ''}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-border/50" />
            
            <DropdownMenuItem 
              onClick={handleProfileClick}
              className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 data-[highlighted]:bg-red-500/10 hover:text-red-400 focus:text-red-400 data-[highlighted]:text-red-400 transition-colors px-3 py-2 rounded-sm mx-1 my-0.5"
            >
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-border/50" />
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer focus:bg-red-500/10 hover:bg-red-500/10 focus:text-red-600 hover:text-red-600 dark:focus:text-red-400 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-sm mx-1 my-0.5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 