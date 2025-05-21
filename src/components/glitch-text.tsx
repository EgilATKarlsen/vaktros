"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  children: React.ReactNode
  className?: string
}

export default function GlitchText({ children, className }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <span
      className={cn(
        "relative inline-block",
        isGlitching &&
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-[5px] after:bg-red-500/30 after:animate-glitch-slide",
        className,
      )}
    >
      <span className={cn("relative inline-block", isGlitching && "animate-glitch-text")}>{children}</span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 -ml-[2px] text-red-500/70 animate-glitch-text-r opacity-70">
            {children}
          </span>
          <span className="absolute top-0 left-0 ml-[2px] text-cyan-500/70 animate-glitch-text-l opacity-70">
            {children}
          </span>
        </>
      )}
    </span>
  )
}
