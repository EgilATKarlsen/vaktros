"use client";

import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack-client";
import { ReactNode } from "react";

interface StackProviderWrapperProps {
  children: ReactNode;
}

export function StackProviderWrapper({ children }: StackProviderWrapperProps) {
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
} 