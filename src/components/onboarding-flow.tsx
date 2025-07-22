"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlitchText from "@/components/glitch-text";
import { 
  Building, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from "lucide-react";

interface OnboardingFlowProps {
  user: {
    id: string;
    displayName: string | null;
    primaryEmail: string | null;
    clientMetadata: Record<string, unknown>;
  };
  suggestedTeamName: string | null;
  userEmail: string | null;
}

type OnboardingStep = "welcome" | "team-assignment" | "completing" | "completed";

export function OnboardingFlow({ user: userData, suggestedTeamName, userEmail }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useUser(); // Use the Stack Auth hook for user operations
  const userTeams = user?.useTeams() || []; // Get user's teams at component level

  const handleStartOnboarding = () => {
    setCurrentStep("team-assignment");
  };

  const handleTeamAssignment = async (action: "join" | "create" | "skip") => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "join" && suggestedTeamName && user) {
        // Check if team already exists in user's teams
        const existingTeam = userTeams.find(team => team.displayName === suggestedTeamName);

        if (existingTeam) {
          // Team already exists and user is already a member
          console.log("User is already part of the team:", existingTeam.displayName);
          setCurrentStep("completing");
        } else {
          // Create new team if it doesn't exist
          await user.createTeam({
            displayName: suggestedTeamName,
          });
          setCurrentStep("completing");
        }
      } else if (action === "create" && suggestedTeamName && user) {
        // Create the team
        await user.createTeam({
          displayName: suggestedTeamName,
        });
        setCurrentStep("completing");
      } else {
        // Skip team assignment
        setCurrentStep("completing");
      }

      // Mark user as onboarded
      if (user) {
        await user.update({
          clientMetadata: {
            ...user.clientMetadata,
            onboarded: true,
            teamAssignmentCompleted: true,
          }
        });
      }

      setCurrentStep("completed");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err: unknown) {
      console.error("Onboarding error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during onboarding");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          <GlitchText>Welcome to VAKTROS</GlitchText>
        </h2>
        <p className="text-muted-foreground text-lg">
          Let&apos;s set up your surveillance network access
        </p>
      </div>

      <Card className="border-red-500/20">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Hello <span className="text-red-500 font-semibold">{userData.displayName || userEmail}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll help you get connected to your organization&apos;s surveillance network
            </p>
          </div>
          
          <Button 
            onClick={handleStartOnboarding}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamAssignmentStep = () => {
    // Check if user is already part of the suggested team
    const existingTeam = suggestedTeamName ? 
      userTeams.find(team => team.displayName === suggestedTeamName) : null;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization Setup</h2>
          <p className="text-muted-foreground">
            Based on your email domain, we&apos;ve identified your organization
          </p>
        </div>

        {suggestedTeamName ? (
          <div className="space-y-6">
            <Card className={`border-blue-500/20 ${existingTeam ? 'bg-green-500/5' : 'bg-blue-500/5'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className={`h-5 w-5 ${existingTeam ? 'text-green-500' : 'text-blue-500'}`} />
                  {suggestedTeamName}
                </CardTitle>
                <CardDescription>
                  Email domain: {userEmail?.split('@')[1]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="secondary" 
                  className={existingTeam ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}
                >
                  {existingTeam ? 'Already a Member' : 'Suggested Organization'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>
                  {existingTeam ? 'You\'re all set!' : 'Choose how you\'d like to proceed:'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {existingTeam ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      You&apos;re already a member of {suggestedTeamName}
                    </p>
                    <Button
                      onClick={() => handleTeamAssignment("skip")}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Continue to Dashboard
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => handleTeamAssignment("join")}
                      disabled={isProcessing}
                      className="w-full justify-start h-auto p-4 bg-red-600 hover:bg-red-700"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Join {suggestedTeamName}</div>
                          <div className="text-xs opacity-80">
                            Create team for your organization
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleTeamAssignment("skip")}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 border-white/10 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Continue Without Team</div>
                          <div className="text-xs opacity-80">
                            Set up team access later
                          </div>
                        </div>
                      </div>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="text-center py-8">
              <AlertCircle className="w-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Organization Detected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn&apos;t automatically detect your organization from your email domain.
              </p>
              
              <Button
                onClick={() => handleTeamAssignment("skip")}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
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
  };

  const renderCompletingStep = () => (
    <Card className="border-blue-500/20">
      <CardContent className="text-center py-12">
        <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold mb-2">Setting up your access...</h3>
        <p className="text-muted-foreground">
          Please wait while we configure your surveillance network access
        </p>
      </CardContent>
    </Card>
  );

  const renderCompletedStep = () => (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardContent className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Welcome to VAKTROS!</h3>
        <p className="text-muted-foreground mb-4">
          Your account has been set up successfully
        </p>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          Redirecting to dashboard...
        </Badge>
      </CardContent>
    </Card>
  );

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <Card className="border-white/10">
        <CardContent className="text-center py-12">
          <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {currentStep === "welcome" && renderWelcomeStep()}
      {currentStep === "team-assignment" && renderTeamAssignmentStep()}
      {currentStep === "completing" && renderCompletingStep()}
      {currentStep === "completed" && renderCompletedStep()}
    </div>
  );
} 