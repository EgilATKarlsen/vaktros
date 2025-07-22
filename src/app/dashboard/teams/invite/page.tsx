"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { TeamInviteForm } from "@/components/team-invite-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Users, AlertTriangle } from "lucide-react";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
}

export default function TeamInvitePage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        redirect("/dashboard/teams");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userTeams = await user.listTeams();
        const team = userTeams?.[0] || null;

        if (!team) {
          redirect("/dashboard/teams");
          return;
        }

        // Check if user has team_admin permission for this team
        try {
          const permissions = await user.listPermissions(team);
          const isAdmin = permissions.some(permission => permission.id === 'team_admin');
          
          if (!isAdmin) {
            // User is not an admin, redirect to teams page
            redirect("/dashboard/teams");
            return;
          }
        } catch (error) {
          console.warn("Error checking team permissions:", error);
          redirect("/dashboard/teams");
          return;
        }

        setCurrentTeam(team);
        setHeader('Invite Team Members', `Invite new members to join ${team.displayName}`);

      } catch (error) {
        console.error('Error loading invite page data:', error);
        setError('Failed to load team data. Please try again.');
        setHeader('Invite Team Members', 'Error loading team data');
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
          <p className="text-muted-foreground">Loading invite page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Invite Page</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Current Team Info */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            {currentTeam.displayName}
          </CardTitle>
          <CardDescription>
            You&apos;re inviting members to this surveillance network team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Team Status:</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Invitations:</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                Email Delivery
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Team Invitation
          </CardTitle>
          <CardDescription>
            Enter the email address of the person you want to invite to your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamInviteForm teamId={currentTeam.id} />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Users className="h-5 w-5" />
            How Team Invitations Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-medium mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Send Invitation</p>
                <p>Enter the recipient&apos;s email address and send the invitation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-medium mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Email Delivery</p>
                <p>The recipient will receive an email with a secure invitation link.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-medium mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Team Membership</p>
                <p>Once accepted, they&apos;ll automatically join your surveillance network team.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            Security Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Verify Recipients:</strong> Only invite trusted individuals who should have access to your surveillance network.
            </p>
            <p>
              <strong className="text-foreground">Secure Links:</strong> Invitation links are time-limited and can only be used once for security.
            </p>
            <p>
              <strong className="text-foreground">Admin Responsibility:</strong> As a team administrator, you&apos;re responsible for managing team access appropriately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 