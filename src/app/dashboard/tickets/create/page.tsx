"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTicketForm } from "@/components/create-ticket-form";
import { ArrowLeft, Plus } from "lucide-react";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
}

export default function CreateTicketPage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        redirect("/dashboard/teams");
        return;
      }

      try {
        const userTeams = await user.listTeams();
        const team = userTeams?.[0] || null;

        if (!team) {
          redirect("/dashboard/teams");
          return;
        }

        setCurrentTeam(team);
        setHeader('Create Support Ticket', 'Submit a support request to our managed services team');
      } catch (error) {
        console.error('Error loading team data:', error);
        setHeader('Create Support Ticket', 'Error loading team data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, setHeader]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Back Navigation - Mobile friendly */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm border-white/10">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Tickets</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      {/* Mobile-first layout - Stack on mobile, side-by-side on desktop */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Help section - Show first on mobile for context */}
        <div className="lg:col-span-1 lg:order-2">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-green-400 text-base sm:text-lg">Tips for Better Support</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <div className="grid gap-3">
                  <div>
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Be Specific</p>
                    <p>Include exact error messages, steps to reproduce, and expected vs actual behavior.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Attach Files</p>
                    <p>Screenshots, logs, or configuration files help us understand the issue faster.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Choose Priority</p>
                    <p>Critical for system outages, High for operational impact, Medium for general issues, Low for feature requests.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Response Time</p>
                    <p>Our team typically responds within 24 hours during business days.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main form - Takes full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2 lg:order-1">
          <Card className="border-blue-500/20">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                New Support Request
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Provide detailed information about your issue to help us resolve it quickly.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <CreateTicketForm
                teamId={currentTeam.id}
                userId={user?.id || ''}
                userName={user?.displayName || 'Unknown User'}
                userEmail={user?.primaryEmail || 'No email'}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 