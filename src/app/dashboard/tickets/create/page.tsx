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
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
      </div>

      {/* Full width layout with main form and help section side by side on larger screens */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form takes up 2/3 of the width on large screens */}
        <div className="lg:col-span-2">
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-500" />
                New Support Request
              </CardTitle>
              <CardDescription>
                Provide detailed information about your issue to help us resolve it quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTicketForm
                teamId={currentTeam.id}
                userId={user?.id || ''}
                userName={user?.displayName || 'Unknown User'}
                userEmail={user?.primaryEmail || 'No email'}
              />
            </CardContent>
          </Card>
        </div>

        {/* Help section takes up 1/3 of the width on large screens, full width on smaller screens */}
        <div className="lg:col-span-1">
          <Card className="border-green-500/20 bg-green-500/5 h-fit">
            <CardHeader>
              <CardTitle className="text-green-400">Tips for Better Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="grid gap-3">
                  <div>
                    <p className="font-medium text-foreground mb-1">Be Specific</p>
                    <p>Include exact error messages, steps to reproduce, and expected vs actual behavior.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Attach Files</p>
                    <p>Screenshots, logs, or configuration files help us understand the issue faster.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Choose Priority</p>
                    <p>Critical for system outages, High for operational impact, Medium for general issues, Low for feature requests.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Response Time</p>
                    <p>Our team typically responds within 24 hours during business days.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 