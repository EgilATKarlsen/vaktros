"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Shield, Settings } from "lucide-react";
import { TeamInvitationHandler } from "@/components/team-invitation-handler";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import { useUser } from "@stackframe/stack";
import { useSearchParams } from "next/navigation";

interface Team {
  id: string;
  displayName: string;
  userRole?: string;
}

// Create a wrapper component for the invitation handler to handle search params
function TeamInvitationWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading invitation...</div>}>
      <TeamInvitationHandler />
    </Suspense>
  );
}

// Main teams content component
function TeamsContent() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const invitationCode = searchParams.get('code');

  useEffect(() => {
    async function loadData() {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userTeams = await user.listTeams();

        // Get user's role in each team based on permissions
        const teamsWithRoles = await Promise.all(
          userTeams.map(async (team) => {
            try {
              // Get user permissions for this team
              const permissions = await user.listPermissions(team);
              
              // Check if user has team_admin permission
              const isAdmin = permissions.some(permission => permission.id === 'team_admin');
              const userRole = isAdmin ? 'Admin' : 'Member';
              
              return {
                ...team,
                userRole
              };
            } catch (error) {
              console.warn(`Could not get permissions for team ${team.id}:`, error);
              return {
                ...team,
                userRole: 'Member' // Default fallback
              };
            }
          })
        );

        setTeams(teamsWithRoles);

        // Set appropriate header based on state
        if (invitationCode) {
          setHeader('Team Invitation', 'Join your surveillance network team');
        } else {
          setHeader('Team Management', 'Manage your surveillance network team membership');
        }

      } catch (error) {
        console.error('Error loading teams data:', error);
        setError('Failed to load teams data. Please try again.');
        setHeader('Team Management', 'Error loading team data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, setHeader, invitationCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Teams</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If there's an invitation code, show the invitation handler
  if (invitationCode) {
    return (
      <div className="space-y-6">
        <TeamInvitationWrapper />
      </div>
    );
  }

  // Regular teams page content
  return (
    <div className="space-y-6">
      {teams.length > 0 ? (
        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id} className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  {team.displayName}
                </CardTitle>
                <CardDescription>
                  Your current surveillance network team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Team ID:</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {team.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <Badge 
                      variant={team.userRole === 'Admin' ? 'default' : 'outline'} 
                      className={`text-xs ${
                        team.userRole === 'Admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' 
                          : ''
                      }`}
                    >
                      {team.userRole}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Team Assigned</h3>
              <p className="text-muted-foreground mb-4">
                You&apos;re not currently assigned to any surveillance network team.
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator or wait for a team invitation to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Users className="h-5 w-5" />
              Team Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Invite new members</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Admin Only
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Join teams via invitation</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Email Link
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Shield className="h-5 w-5" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Single team membership</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  Enforced
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Invite code validation</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  Required
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Email verification</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component wrapper
export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <TeamsContent />
    </Suspense>
  );
} 