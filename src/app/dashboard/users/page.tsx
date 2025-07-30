"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Settings, AlertTriangle } from "lucide-react";
import { TeamMembersTable } from "@/components/team-members-table";
import { useDashboardHeader } from "@/components/dashboard-header-context";
import { useUser } from "@stackframe/stack";

interface Team {
  id: string;
  displayName: string;
}

export default function UsersPage() {
  const user = useUser();
  const { setHeader } = useDashboardHeader();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('Member');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userTeams = await user.listTeams();
        const team = userTeams?.[0] || null;

        if (team) {
          try {
            const permissions = await user.listPermissions(team);
            const adminStatus = permissions.some(permission => permission.id === 'team_admin');
            const role = adminStatus ? 'Admin' : 'Member';
            
            setIsAdmin(adminStatus);
            setUserRole(role);
          } catch (error) {
            console.warn("Error checking user permissions:", error);
          }
        }

        setCurrentTeam(team);
        setHeader('Team Members', team 
          ? `View and manage members of ${team.displayName}` 
          : 'No team assigned'
        );

      } catch (error) {
        console.error('Error loading users data:', error);
        setError('Failed to load team members data. Please try again.');
        setHeader('Team Members', 'Error loading members');
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
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Team Members</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentTeam ? (
        <div className="space-y-6">
          {/* Team Overview */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {currentTeam.displayName}
              </CardTitle>
              <CardDescription>
                Team member management and role assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Your Role:</span>
                  <Badge 
                    variant={isAdmin ? 'default' : 'outline'} 
                    className={`text-xs ${
                      isAdmin 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' 
                        : ''
                    }`}
                  >
                    {userRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Permissions:</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                    {isAdmin ? 'Full Access' : 'View Only'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                  <Users className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Team Status:</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                All members of your surveillance network team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembersTable 
                teamId={currentTeam.id} 
                currentUserId={user?.id || ''}
                isCurrentUserAdmin={isAdmin}
              />
            </CardContent>
          </Card>

          {/* Admin Actions */}
          {isAdmin && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Shield className="h-5 w-5" />
                  Administrator Actions
                </CardTitle>
                <CardDescription>
                  Available actions for team administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Invite new members</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manage member roles</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Remove team members</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      With Caution
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Data Protection:</strong> All member information is encrypted and access-controlled.
                </p>
                <p>
                  <strong className="text-foreground">Role-Based Access:</strong> Team members can only see information appropriate to their role level.
                </p>
                <p>
                  <strong className="text-foreground">Audit Trail:</strong> All member management actions are logged for security review.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Team Assigned</h3>
              <p className="text-muted-foreground mb-4">
                You need to be part of a team to view team members.
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator or wait for a team invitation to access member management.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 