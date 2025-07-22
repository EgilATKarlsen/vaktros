import { stackServerApp, getTeamFromEmail } from "@/stack";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding-flow";

export default async function OnboardingPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in");
  }

  // Check if user has already been onboarded
  if (user.clientMetadata?.onboarded) {
    redirect("/dashboard");
  }

  const userEmail = user.primaryEmail;
  const suggestedTeamName = userEmail ? getTeamFromEmail(userEmail) : null;

  // Extract only serializable user data for the client component
  const userData = {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
    clientMetadata: user.clientMetadata,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingFlow 
          user={userData}
          suggestedTeamName={suggestedTeamName}
          userEmail={userEmail}
        />
      </div>
    </div>
  );
} 