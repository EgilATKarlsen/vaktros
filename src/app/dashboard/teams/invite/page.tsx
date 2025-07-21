import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { TeamInviteForm } from "@/components/team-invite-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Link as LinkIcon, Users } from "lucide-react";

export default async function TeamInvitePage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const userTeams = await user.listTeams();

  // Users can only be part of one team at a time
  const currentTeam = userTeams?.[0] || null;

  if (!currentTeam) {
    redirect("/dashboard/teams");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invite Team Members</h2>
        <p className="text-muted-foreground">
          Invite new members to join your surveillance network team.
        </p>
      </div>

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Team ID:</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {currentTeam.id}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Methods */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Invitation */}
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Email Invitation
            </CardTitle>
            <CardDescription>
              Send a direct invitation email to new team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamInviteForm 
              teamId={currentTeam.id} 
              teamName={currentTeam.displayName}
              inviteType="email"
            />
          </CardContent>
        </Card>

        {/* Invite Code */}
        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-purple-500" />
              Invite Code
            </CardTitle>
            <CardDescription>
              Generate a shareable invite code for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamInviteForm 
              teamId={currentTeam.id} 
              teamName={currentTeam.displayName}
              inviteType="code"
            />
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="border-gray-500/20">
        <CardHeader>
          <CardTitle className="text-lg">How Team Invitations Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Email Invitations</p>
                <p>Send direct email invitations to specific users. They&apos;ll receive a link to join your team.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <LinkIcon className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Invite Codes</p>
                <p>Generate shareable codes that anyone can use to join your team. Perfect for bulk invitations.</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                <strong>Note:</strong> Users can only be part of one surveillance network team at a time. 
                Joining a new team will remove them from their current team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 