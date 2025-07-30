import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    afterSignUp: "/onboarding",
    afterSignIn: "/dashboard",
  },
  // Only include these if environment variables are set
  ...(process.env.NEXT_PUBLIC_STACK_PROJECT_ID && {
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  }),
  ...(process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY && {
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  }),
  ...(process.env.STACK_SECRET_SERVER_KEY && {
    secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
  }),
});

// Domain to team mapping - add more domains as needed
export const DOMAIN_TEAM_MAPPING: Record<string, string> = {
  "data.com": "Data Corp",
  "techcorp.com": "Tech Corporation", 
  "security.org": "Security Organization",
  "surveillance.net": "Surveillance Network",
  "vaktros.com": "VAKTROS, Inc.",
  // Add more domain mappings here
};

// Helper function to extract domain from email
export function getDomainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

// Helper function to get team name from email domain
export function getTeamFromEmail(email: string): string | null {
  const domain = getDomainFromEmail(email);
  return DOMAIN_TEAM_MAPPING[domain] || null;
}
