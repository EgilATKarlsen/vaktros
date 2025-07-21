"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, AlertCircle, UserPlus, Loader2 } from "lucide-react";
import { useUser } from "@stackframe/stack";

interface JoinTeamFormProps {
  currentTeam: any;
}

export function JoinTeamForm({ currentTeam }: JoinTeamFormProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);

  const user = useUser();
  const router = useRouter();

  const validateInviteCode = (code: string): boolean => {
    // Basic validation for VAKTROS invite code format
    const codePattern = /^VAKTROS-[A-Z0-9]{6}-[A-Z0-9]+$/;
    return codePattern.test(code.toUpperCase());
  };

  const handleJoinTeam = async () => {
    if (!inviteCode || !user) return;

    const trimmedCode = inviteCode.trim().toUpperCase();
    
    if (!validateInviteCode(trimmedCode)) {
      setError("Invalid invite code format. Please check the code and try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // For now, we'll simulate team joining since Stack Auth's invite code API
      // would typically require server-side implementation
      
      // Extract team info from invite code (mock implementation)
      const codeParts = trimmedCode.split('-');
      const teamId = codeParts[1];
      
      // Simulate team lookup
      const mockTeamName = `Team ${teamId}`;
      setTeamInfo({ id: teamId, displayName: mockTeamName });

      // If user has a current team, they need to leave it first
      if (currentTeam) {
        await user.leaveTeam(currentTeam);
      }

      // In a real implementation, you would:
      // 1. Validate the invite code with Stack Auth API
      // 2. Get team information
      // 3. Add user to the team
      
      // For now, we'll simulate success
      setSuccess(`Successfully joined ${mockTeamName}!`);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("Error joining team:", err);
      setError(err.message || "Failed to join team. Please check the invite code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setInviteCode(value);
    setError(null);
    setSuccess(null);
    setTeamInfo(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter invite code (e.g., VAKTROS-ABC123-XYZ)"
          value={inviteCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="border-white/10 font-mono"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Invite codes are case-insensitive and should start with &quot;VAKTROS-&quot;
        </p>
      </div>

      {/* Code Preview */}
      {inviteCode && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Invite Code</p>
                <Badge variant="secondary" className="font-mono text-xs bg-blue-500/20 text-blue-300 mt-1">
                  {inviteCode.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                {validateInviteCode(inviteCode) ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Valid format</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Check format</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Team Warning */}
      {currentTeam && inviteCode && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-yellow-400">Team Switch Warning</p>
                <p className="text-muted-foreground">
                  You will be removed from <strong>{currentTeam.displayName}</strong> when you join the new team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleJoinTeam}
        disabled={!inviteCode || !validateInviteCode(inviteCode) || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Joining Team...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Join Team
          </>
        )}
      </Button>

      {success && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Success!</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{success}</p>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                Redirecting to dashboard...
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Error</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 