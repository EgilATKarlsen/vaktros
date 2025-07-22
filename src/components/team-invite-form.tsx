"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "@stackframe/stack";

interface TeamInviteFormProps {
  teamId: string;
}

export function TeamInviteForm({ teamId }: TeamInviteFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useUser();
  const userTeams = user?.useTeams() || [];

  const handleEmailInvite = async () => {
    if (!email || !user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Find the team in user's teams
      const team = userTeams.find(t => t.id === teamId);
      
      if (!team) {
        throw new Error("Team not found");
      }

      // Send email invitation using Stack Auth with correct parameter format
      await team.inviteUser({ 
        email: email,
        callbackUrl: `${window.location.origin}/dashboard/teams`
      });
      
      setSuccess(`Invitation sent to ${email}!`);
      setEmail("");
    } catch (err: unknown) {
      console.error("Error sending invitation:", err);
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-white/10"
        />
      </div>

      <Button
        onClick={handleEmailInvite}
        disabled={!email || isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isLoading ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Invitation
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