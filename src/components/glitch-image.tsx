"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface GlitchImageProps extends ImageProps {
  glitchIntensity?: number // 0-1
}

export default function GlitchImage({ className, ...props }: GlitchImageProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const { theme } = useTheme()
  
  const isLightMode = theme === 'light'

  useEffect(() => {
    // Skip glitch effect in light mode
    if (isLightMode) {
      setIsGlitching(false)
      return
    }
    
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200 + Math.random() * 300)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [isLightMode])

  return (
    <div className="relative overflow-hidden">
      <Image {...props} className={cn(isGlitching && "animate-glitch-image", className)} />

      {isGlitching && !isLightMode && (
        <>
          <div className="absolute inset-0 bg-red-500/10 mix-blend-screen animate-glitch-overlay-1"></div>
          <div className="absolute inset-0 bg-cyan-500/10 mix-blend-screen animate-glitch-overlay-2"></div>
          <div className="absolute h-[1px] w-full bg-white/70 left-0 animate-glitch-scan-line"></div>
        </>
      )}
    </div>
  )
}
