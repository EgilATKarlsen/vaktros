import Link from "next/link";
import { CameraIcon } from "lucide-react";
import GlitchText from "@/components/glitch-text";

export default function Header() {
  return (
    <header className="border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CameraIcon className="h-6 w-6 text-red-500" />
          <GlitchText className="text-xl font-bold tracking-wider">VAKTROS</GlitchText>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#revolution" className="text-sm hover:text-red-400 transition-colors">
            PRODUCT
          </Link>
          <Link href="#team" className="text-sm hover:text-red-400 transition-colors">
            TEAM
          </Link>
          <Link href="#contact" className="text-sm hover:text-red-400 transition-colors">
            CONTACT
          </Link>
        </div>
      </div>
    </header>
  );
} 