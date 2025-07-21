import { stackServerApp } from "@/stack";
import { JoinTeamForm } from "@/components/join-team-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Key, Users, AlertTriangle } from "lucide-react";

export default async function JoinTeamPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const userTeams = await user.listTeams();
  const currentTeam = userTeams?.[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Join Team</h2>
        <p className="text-muted-foreground">
          Use an invite code to join a surveillance network team.
        </p>
      </div>

      {/* Current Team Status */}
      {currentTeam && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Current Team</p>
                <p className="text-xs text-muted-foreground">
                  You&apos;re currently a member of <strong>{currentTeam.displayName}</strong>. 
                  Joining a new team will remove you from your current team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Join Team Form */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            Enter Invite Code
          </CardTitle>
          <CardDescription>
            Enter the invite code provided by your team administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinTeamForm currentTeam={currentTeam} />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-gray-500/20">
        <CardHeader>
          <CardTitle className="text-lg">How to Join a Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Get an Invite Code</p>
                <p>Ask your team administrator for an invite code. It will look like: <code className="bg-muted px-1 rounded text-xs">VAKTROS-ABC123-XYZ</code></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Enter the Code</p>
                <p>Paste or type the invite code in the form above and click &quot;Join Team&quot;</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Access Team Features</p>
                <p>Once joined, you&apos;ll have access to your team&apos;s surveillance network and shared resources</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-400 text-sm">Team Membership Rules</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Users can only be part of one team at a time</li>
                    <li>• Joining a new team automatically removes you from your current team</li>
                    <li>• Team administrators can invite users via email or generate invite codes</li>
                    <li>• Invite codes are case-sensitive and may expire</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 