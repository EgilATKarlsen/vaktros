"use client"

import { useState, useEffect } from "react"

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState(0)

  useEffect(() => {
    const handleThemeChange = () => {
      setThemeKey(prev => prev + 1)
    }

    window.addEventListener('themeChanged', handleThemeChange)
    return () => window.removeEventListener('themeChanged', handleThemeChange)
  }, [])

  return <div key={themeKey}>{children}</div>
} 