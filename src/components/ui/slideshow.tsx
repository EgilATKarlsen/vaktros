"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface SlideData {
  id: string
  title: string
  description: string
  image: string
  stats?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
  content?: ReactNode
}

interface SlideshowProps {
  slides: SlideData[]
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showProgress?: boolean
  showIndicators?: boolean
  className?: string
  imageOverlay?: (slide: SlideData, currentIndex: number) => ReactNode
  contentSide?: "left" | "right"
}

export default function Slideshow({
  slides,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showProgress = true,
  showIndicators = true,
  className = "",
  imageOverlay,
  contentSide = "right",
}: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setProgress(0)
    }, interval)

    return () => clearInterval(slideInterval)
  }, [isPlaying, interval, slides.length])

  useEffect(() => {
    if (!isPlaying) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 100 / (interval / 100)
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isPlaying, currentSlide, interval])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  const currentSlideData = slides[currentSlide]
  const Icon = currentSlideData.icon

  const imageContent = (
    <div className="relative aspect-video md:aspect-square bg-muted/30 dark:bg-gray-900">
      <img
        src={currentSlideData.image || "/placeholder.svg"}
        alt={currentSlideData.title}
        className="w-full h-full object-cover"
      />
      {imageOverlay && imageOverlay(currentSlideData, currentSlide)}
    </div>
  )

  const textContent = (
    <div className="p-8 flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className={`h-12 w-12 rounded-lg ${currentSlideData.bgColor || "bg-muted/50"} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${currentSlideData.color || "text-foreground"}`} />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold">{currentSlideData.title}</h3>
          {currentSlideData.stats && (
            <span className={`text-sm font-mono ${currentSlideData.color || "text-muted-foreground"}`}>
              {currentSlideData.stats}
            </span>
          )}
        </div>
      </div>

      <div className="text-muted-foreground leading-relaxed mb-6">
        {currentSlideData.content || currentSlideData.description}
      </div>

      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono">
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1">
            <div
              className="h-1 rounded-full transition-all duration-100 bg-red-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {(showControls || showIndicators) && (
        <div className="flex items-center justify-between">
          {showControls && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevSlide} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="h-8 w-8 p-0">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={nextSlide} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showIndicators && (
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-red-500" : "bg-muted/50 hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className={`relative max-w-6xl mx-auto ${className}`}>
      <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {contentSide === "left" ? (
            <>
              {textContent}
              {imageContent}
            </>
          ) : (
            <>
              {imageContent}
              {textContent}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
