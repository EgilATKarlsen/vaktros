"use client";

import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
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
}); 