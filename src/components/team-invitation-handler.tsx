"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Building, 
  Mail, 
  Loader2,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { checkTeamInvitation, acceptTeamInvitation } from "@/app/actions/team-invitations";

interface TeamInvitation {
  teamId: string;
  teamName: string;
  inviterName?: string;
  inviterEmail?: string;
}

export function TeamInvitationHandler() {
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const user = useUser();
  const userTeams = user?.useTeams() || [];
  const currentTeam = userTeams[0] || null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get("code");

  useEffect(() => {
    if (invitationCode && user) {
      verifyInvitationCode(invitationCode);
    } else if (!invitationCode) {
      setError("No invitation code provided");
      setIsVerifying(false);
    }
  }, [invitationCode, user]);

  const verifyInvitationCode = async (code: string) => {
    try {
      setIsVerifying(true);
      setError(null);

      console.log("🔍 Client: Verifying invitation code:", code);
      const result = await checkTeamInvitation(code);
      console.log("📥 Client: Server action result:", result);

      if (!result.success) {
        console.error("❌ Client: Verification failed:", result);
        throw new Error(result.error || "Failed to verify invitation");
      }

      // Extract team information from the response
      const teamData = result.invitation;
      console.log("✅ Client: Team data extracted:", teamData);
      
      setInvitation({
        teamId: teamData.team_id || teamData.teamId,
        teamName: teamData.team_name || teamData.teamDisplayName || "Unknown Team",
        inviterName: teamData.inviter_name || teamData.inviterName,
        inviterEmail: teamData.inviter_email || teamData.inviterEmail,
      });

      setShowConfirmation(true);
    } catch (err: any) {
      console.error("💥 Client: Error verifying invitation:", err);
      setError(err.message || "Failed to verify invitation code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitationCode || !invitation) return;

    try {
      setIsAccepting(true);
      setError(null);

      // If user has a current team, they need to leave it first
      if (currentTeam) {
        await user?.leaveTeam(currentTeam);
      }

      // Accept the invitation using server action
      const result = await acceptTeamInvitation(invitationCode);

      if (!result.success) {
        throw new Error(result.error || "Failed to accept invitation");
      }

      setSuccess(`Successfully joined ${invitation.teamName}!`);
      setShowConfirmation(false);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError(err.message || "Failed to accept invitation");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineInvitation = () => {
    router.push("/dashboard/teams");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading user data...</div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <Card className="border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">Verifying invitation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !invitation) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 py-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium text-red-400">Invalid Invitation</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/teams")}
            variant="outline"
            className="mt-4 w-full"
          >
            Back to Teams
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 py-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-400">Invitation Accepted!</p>
              <p className="text-sm text-muted-foreground">{success}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs mt-2">
            Redirecting to dashboard...
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (showConfirmation && invitation) {
    return (
      <div className="space-y-6">
        {/* Invitation Details */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Team Invitation
            </CardTitle>
            <CardDescription>
              You&apos;ve been invited to join a surveillance network team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{invitation.teamName}</p>
                  <p className="text-sm text-muted-foreground">Team Name</p>
                </div>
              </div>

              {invitation.inviterName && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{invitation.inviterName}</p>
                    <p className="text-sm text-muted-foreground">Invited by</p>
                  </div>
                </div>
              )}

              {invitation.inviterEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{invitation.inviterEmail}</p>
                    <p className="text-sm text-muted-foreground">Inviter Email</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Team Warning */}
        {currentTeam && (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">Current Team Status</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re currently a member of <strong>{currentTeam.displayName}</strong>. 
                    Accepting this invitation will remove you from your current team since users 
                    can only be part of one team at a time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Actions */}
        <Card className="border-gray-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Confirm Team Invitation</CardTitle>
            <CardDescription>
              Do you want to join {invitation.teamName}?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Accept & Join Team
                  </>
                )}
              </Button>

              <Button
                onClick={handleDeclineInvitation}
                variant="outline"
                disabled={isAccepting}
                className="flex-1 border-white/20"
              >
                Decline
              </Button>
            </div>

            {error && (
              <Card className="border-red-500/20 bg-red-500/5 mt-4">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">Error</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
} 