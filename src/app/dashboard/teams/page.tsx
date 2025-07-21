import { stackServerApp } from "@/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Shield, Settings } from "lucide-react";
import { Suspense } from "react";
import { TeamInvitationHandler } from "@/components/team-invitation-handler";

// Create a wrapper component for the invitation handler to handle search params
function TeamInvitationWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading invitation...</div>}>
      <TeamInvitationHandler />
    </Suspense>
  );
}

// Server component for the main teams page content
async function TeamsContent({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const userTeams = await user.listTeams(); // Use correct API to get user's teams only
  const params = await searchParams; // Await searchParams

  // If there's an invitation code, show the invitation handler
  if (params.code) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Invitation</h2>
          <p className="text-muted-foreground">
            You&apos;ve been invited to join a surveillance network team.
          </p>
        </div>
        <TeamInvitationWrapper />
      </div>
    );
  }

  // Regular teams page content
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        <p className="text-muted-foreground">
          Manage your organization&apos;s surveillance network access and team settings.
        </p>
      </div>

      {userTeams.length > 0 ? (
        <div className="grid gap-6">
          {userTeams.map((team) => (
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
                    <Badge variant="outline" className="text-xs">
                      Member
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
                Contact your administrator or use an invite code to join a team.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Management Actions */}
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
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Generate invite codes</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Join new teams</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  With Code
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

// Main page component that receives search params
export default async function TeamsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ code?: string }> 
}) {
  return <TeamsContent searchParams={searchParams} />;
} 