import type React from "react"
import Link from "next/link"
import Image from "next/image"
import GlitchText from "@/components/glitch-text"

interface DemoLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function DemoLayout({ title, description, children }: DemoLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/vaktros.svg" alt="Vaktros Logo" width={28} height={28} className="text-red-500" />
              <span className="text-xl font-bold tracking-wider">VAKTROS</span>
            </Link>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold">
              <GlitchText>{title}</GlitchText>
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-3xl">{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  )
}
