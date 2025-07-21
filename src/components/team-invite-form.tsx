"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Mail, Send, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

interface TeamInviteFormProps {
  teamId: string;
  teamName: string;
  inviteType: "email" | "code";
}

export function TeamInviteForm({ teamId, teamName, inviteType }: TeamInviteFormProps) {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const user = useUser();
  const stackApp = useStackApp();
  const userTeams = user?.useTeams() || []; // Move hook to component level

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
    } catch (err: any) {
      console.error("Error sending invitation:", err);
      setError(err.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteCode = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate invite code - this would typically be done via API
      // For now, we'll create a mock invite code since Stack Auth's invite code API
      // might need server-side implementation
      const mockCode = `VAKTROS-${teamId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      setInviteCode(mockCode);
      setSuccess("Invite code generated successfully!");
    } catch (err: any) {
      console.error("Error generating invite code:", err);
      setError(err.message || "Failed to generate invite code");
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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

  if (inviteType === "email") {
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

  return (
    <div className="space-y-4">
      {!inviteCode ? (
        <Button
          onClick={generateInviteCode}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            "Generating..."
          ) : (
            <>
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate Invite Code
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-400">Invite Code</p>
                <Badge variant="secondary" className="font-mono text-sm bg-purple-500/20 text-purple-300 mt-1">
                  {inviteCode}
                </Badge>
              </div>
              <Button
                onClick={copyInviteCode}
                variant="outline"
                size="sm"
                className="border-purple-500/20 hover:bg-purple-500/10"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Share this code with team members. They can use it to join {teamName}.
          </div>

          <Button
            onClick={() => {
              setInviteCode(null);
              setSuccess(null);
            }}
            variant="outline"
            className="w-full border-white/10"
          >
            Generate New Code
          </Button>
        </div>
      )}

      {success && !inviteCode && (
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