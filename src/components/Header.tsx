"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@stackframe/stack";
import GlitchText from "@/components/glitch-text";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const user = useUser();

  return (
    <header className="border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/vaktros.svg" alt="Vaktros Logo" width={24} height={24} className="text-red-500" />
          <GlitchText className="text-xl font-bold tracking-wider">VAKTROS</GlitchText>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#revolution" className="text-sm hover:text-red-400 transition-colors">
            PRODUCT
          </Link>
          <Link href="#testimonials" className="text-sm hover:text-red-400 transition-colors">
            TESTIMONIALS
          </Link>
          <Link href="#team" className="text-sm hover:text-red-400 transition-colors">
            TEAM
          </Link>
          <Link href="#contact" className="text-sm hover:text-red-400 transition-colors">
            CONTACT
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            // User is logged in - show dashboard and logout
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm hover:text-red-400 transition-colors"
              >
                DASHBOARD
              </Link>
              <Link 
                href="/handler/sign-out" 
                className="text-sm hover:text-red-400 transition-colors"
              >
                SIGN OUT
              </Link>
            </div>
          ) : (
            // User is not logged in - show login
            <Link 
              href="/handler/sign-in" 
              className="text-sm hover:text-red-400 transition-colors"
            >
              SIGN IN
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 