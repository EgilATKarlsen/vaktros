"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function CctvBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isLightMode = theme === 'light'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resize)
    resize()

    // Create a more random and sporadic CCTV layout
    const NUM_CAMERAS = Math.floor(Math.random() * 21) + 30; // 30-50 cameras
    const cameras: Camera[] = []

    // Global glitch state - much slower timing
    let globalGlitchActive = false
    let globalGlitchTimer = Math.random() * 30000 + 30000
    let globalGlitchDuration = 0

    // Camera class to simulate CCTV feeds with more randomness
    class Camera {
      x: number
      y: number
      width: number
      height: number
      noise: number
      scanLine: number
      glitchTimer: number
      glitchDuration: number
      isGlitching: boolean
      feedType: number // Different types of camera feeds
      frameRate: number // Variable frame rates
      brightness: number
      staticAmount: number
      isOffline: boolean
      offlineTimer: number
      colorTint: { r: number; g: number; b: number }
      aspectRatio: number // Store the aspect ratio

      constructor() {
        // Random aspect ratio between 1.5 and 3.5
        this.aspectRatio = Math.random() * 2 + 1.5
        // Random width (5% to 20% of canvas width)
        this.width = Math.random() * (window.innerWidth * 0.15) + window.innerWidth * 0.05
        this.height = this.width / this.aspectRatio
        // Random position, ensuring camera stays within bounds
        this.x = Math.random() * (window.innerWidth - this.width)
        this.y = Math.random() * (window.innerHeight - this.height)

        this.noise = Math.random() * 0.2
        this.scanLine = Math.floor(Math.random() * this.height)
        this.glitchTimer = Math.random() * 25000 + 20000
        this.glitchDuration = 0
        this.isGlitching = false
        // Force feed type to -1 in light mode to completely disable any feed content
        this.feedType = isLightMode ? -1 : Math.floor(Math.random() * 4)
        this.frameRate = Math.random() * 2 + 2 // 2-4 fps simulation
        this.brightness = Math.random() * 0.5 + 0.5
        this.staticAmount = Math.random() * 0.3
        this.isOffline = isLightMode ? false : Math.random() > 0.95
        this.offlineTimer = Math.random() * 20000 + 10000
        this.colorTint = {
          r: Math.random() > 0.7 ? Math.random() * 30 : 0,
          g: Math.random() > 0.7 ? Math.random() * 30 : 0,
          b: Math.random() > 0.7 ? Math.random() * 30 : 0,
        }
      }

      draw(ctx: CanvasRenderingContext2D, timestamp: number) {
        // Skip frames based on frameRate to simulate different camera speeds
        if (timestamp % Math.floor(60 / this.frameRate) !== 0 && !this.isOffline) return

        // Camera feed background
        if (this.isOffline && !isLightMode) {
          // Static noise for offline cameras - only in dark mode
          ctx.fillStyle = `rgb(30, 30, 30)`
          ctx.fillRect(this.x, this.y, this.width, this.height)
          this.drawNoise(ctx, 0.8)

          // "NO SIGNAL" text occasionally
          if (Math.random() > 0.7) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
            ctx.font = "10px monospace"
            ctx.textAlign = "center"
            ctx.fillText("NO SIGNAL", this.x + this.width / 2, this.y + this.height / 2)
          }
        } else {
          // Active camera feed
          const baseColor = isLightMode ? 240 : Math.floor(Math.random() * 40) * this.brightness
          ctx.fillStyle = `rgb(${baseColor}, ${baseColor}, ${baseColor})`
          ctx.fillRect(this.x, this.y, this.width, this.height)

          // Only draw effects in dark mode
          if (!isLightMode) {
            this.drawFeedContent(ctx)
            this.drawNoise(ctx, this.staticAmount)
            this.drawScanLines(ctx)
            if (this.isGlitching || globalGlitchActive) {
              this.drawGlitch(ctx)
            }
          }

          // Add timestamp or camera ID occasionally - dark mode only
          if (Math.random() > 0.98 && !isLightMode) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
            ctx.font = "8px monospace"
            ctx.textAlign = "start"
            const date = new Date()
            ctx.fillText(
              `CAM${Math.floor(Math.random() * 999)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
              this.x + 5,
              this.y + this.height - 5,
            )
          }
        }

        // Camera border - thicker for glitching cameras, but only in dark mode
        ctx.strokeStyle = (this.isGlitching && !isLightMode) ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.5)"
        ctx.lineWidth = (this.isGlitching && !isLightMode) ? 2 : 1
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        // Update camera state only in dark mode
        if (!isLightMode) {
          this.updateState()
        }
      }

      drawFeedContent(ctx: CanvasRenderingContext2D) {
        // Skip all feed content in light mode or if feedType is -1
        if (isLightMode || this.feedType === -1) return;

        switch (this.feedType) {
          case 0: // Empty room/hallway with occasional movement
            if (Math.random() > 0.98) {
              ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
              const size = Math.random() * 10 + 5
              const x = this.x + Math.random() * (this.width - size)
              const y = this.y + Math.random() * (this.height - size)
              ctx.fillRect(x, y, size, size)
            }
            break;
          case 1: // Parking lot/street with occasional car movement
            if (Math.random() > 0.95) {
              // Less frequent (was 0.9)
              ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
              const width = Math.random() * 15 + 10
              const height = Math.random() * 8 + 5
              const x = this.x + Math.random() * (this.width - width)
              const y = this.y + Math.random() * (this.height - height)
              ctx.fillRect(x, y, width, height)
            }
            break
          case 2: // Store/retail with multiple moving objects
            for (let i = 0; i < 3; i++) {
              if (Math.random() > 0.9) {
                // Less frequent (was 0.8)
                ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
                const size = Math.random() * 5 + 3
                const x = this.x + Math.random() * (this.width - size)
                const y = this.y + Math.random() * (this.height - size)
                ctx.fillRect(x, y, size, size)
              }
            }
            break
          case 3: // Infrared/night vision
            ctx.fillStyle = "rgba(0, 255, 0, 0.05)"
            ctx.fillRect(this.x, this.y, this.width, this.height)
            if (Math.random() > 0.95) {
              // Less frequent (was 0.9)
              ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
              const size = Math.random() * 8 + 4
              const x = this.x + Math.random() * (this.width - size)
              const y = this.y + Math.random() * (this.height - size)
              ctx.beginPath()
              ctx.arc(x, y, size, 0, Math.PI * 2)
              ctx.fill()
            }
            break
        }
      }

      drawNoise(ctx: CanvasRenderingContext2D, intensity: number) {
        const imageData = ctx.getImageData(this.x, this.y, this.width, this.height)
        const data = imageData.data
        const noiseIntensity = intensity || this.noise

        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.7) {
            // Less noise (was 0.6)
            // Make noise more sparse
            const noise = Math.random() * noiseIntensity * 255
            data[i] = Math.min(data[i] + noise, 255)
            data[i + 1] = Math.min(data[i + 1] + noise, 255)
            data[i + 2] = Math.min(data[i + 2] + noise, 255)
          }
        }

        ctx.putImageData(imageData, this.x, this.y)
      }

      drawScanLines(ctx: CanvasRenderingContext2D) {
        // Primary scan line
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(this.x, this.y + this.scanLine, this.width, 2)

        // Occasional multiple scan lines
        if (Math.random() > 0.9) {
          // Less frequent (was 0.8)
          const numLines = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < numLines; i++) {
            const y = this.y + Math.floor(Math.random() * this.height)
            const opacity = Math.random() * 0.1
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.fillRect(this.x, y, this.width, 1)
          }
        }

        // Update scan line position with even slower speed
        this.scanLine = (this.scanLine + (Math.random() * 0.5 + 0.1)) % this.height // Much slower (was 1+0.2)
      }

      drawGlitch(ctx: CanvasRenderingContext2D) {
        // Double check we're not in light mode
        if (isLightMode) return;

        // Horizontal glitch lines with more randomness
        const numGlitchLines = Math.floor(Math.random() * 6) + 1
        for (let i = 0; i < numGlitchLines; i++) {
          const y = this.y + Math.floor(Math.random() * this.height)
          const height = Math.floor(Math.random() * 5) + 1
          const offset = Math.floor(Math.random() * 20) - 10

          try {
            // Get image data for the glitch line
            const imageData = ctx.getImageData(this.x, y, this.width, height)
            // Clear the original area
            ctx.clearRect(this.x, y, this.width, height)
            // Draw the image data with offset
            ctx.putImageData(imageData, this.x + offset, y)
          } catch (e) {
            console.error("Error in camera glitch effect:", e)
          }
        }

        // Vertical glitch lines occasionally
        if (Math.random() > 0.8) {
          const numVertGlitches = Math.floor(Math.random() * 2) + 1
          for (let i = 0; i < numVertGlitches; i++) {
            const x = this.x + Math.floor(Math.random() * this.width)
            const width = Math.floor(Math.random() * 5) + 1
            const offset = Math.floor(Math.random() * 10) - 5

            try {
              const imageData = ctx.getImageData(x, this.y, width, this.height)
              ctx.clearRect(x, this.y, width, this.height)
              ctx.putImageData(imageData, x, this.y + offset)
            } catch (e) {
              console.error("Error in vertical glitch effect:", e)
            }
          }
        }

        // Color distortion with more variation
        if (Math.random() > 0.6) {
          const colorChoice = Math.floor(Math.random() * 3)
          let color = "rgba(255, 0, 0, 0.1)"

          if (colorChoice === 1) color = "rgba(0, 255, 0, 0.1)"
          else if (colorChoice === 2) color = "rgba(0, 0, 255, 0.1)"

          ctx.fillStyle = color
          ctx.fillRect(this.x, this.y, this.width, this.height)
        }
      }

      updateState() {
        // Update glitch state
        if (!globalGlitchActive) {
          this.glitchTimer -= 16.7 // Approximately 60fps
          if (this.glitchTimer <= 0) {
            if (!this.isGlitching) {
              this.isGlitching = Math.random() > 0.9 // 10% chance to start glitching (was 0.85)
              this.glitchDuration = Math.random() * 3000 + 1000 // 1-4 seconds glitch (longer duration)
            } else {
              this.isGlitching = false
              this.glitchTimer = Math.random() * 25000 + 15000 // 15-40 seconds until next glitch (was 15000+10000)
            }
          }

          if (this.isGlitching) {
            this.glitchDuration -= 16.7
            if (this.glitchDuration <= 0) {
              this.isGlitching = false
              this.glitchTimer = Math.random() * 25000 + 15000
            }
          }
        }

        // Update offline state
        this.offlineTimer -= 16.7
        if (this.offlineTimer <= 0) {
          // 3% chance to change state (was 5%)
          if (Math.random() > 0.97) {
            this.isOffline = !this.isOffline
          }
          this.offlineTimer = Math.random() * 20000 + 10000
        }

        // Random noise fluctuation
        if (Math.random() > 0.995) {
          // Less frequent (was 0.99)
          this.noise = Math.random() * 0.2
          this.staticAmount = Math.random() * 0.3
        }
      }
    }

    // Initialize cameras with random positions and sizes
    const initCameras = () => {
      cameras.length = 0
      for (let i = 0; i < NUM_CAMERAS; i++) {
        cameras.push(new Camera())
      }
    }

    initCameras()
    window.addEventListener("resize", initCameras)

    // Animation loop with reduced framerate (10 FPS)
    let frameCount = 0
    let lastFrameTime = 0
    const FPS = 10
    const FRAME_DURATION = 1000 / FPS
    function animate(now: number) {
      // Null checks for canvas and ctx
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (now - lastFrameTime < FRAME_DURATION) {
        requestAnimationFrame(animate)
        return
      }
      lastFrameTime = now
      frameCount++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isLightMode) {
        // In light mode, only draw subtle rolling scanlines
        const scanlineOpacity = 0.02;
        ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
        for (let y = 0; y < canvas.height; y += 4) {
          const offset = (frameCount * 0.5) % 4; // Very slow downward movement
          ctx.fillRect(0, (y + offset) % canvas.height, canvas.width, 1);
        }
        requestAnimationFrame(animate);
        return;
      }

      // Dark mode - update glitch state and draw effects
      globalGlitchTimer -= FRAME_DURATION
      if (globalGlitchTimer <= 0) {
        if (!globalGlitchActive) {
          globalGlitchActive = Math.random() > 0.9
          globalGlitchDuration = Math.random() * 4000 + 2000
        } else {
          globalGlitchActive = false
          globalGlitchTimer = Math.random() * 40000 + 30000
        }
      }
      if (globalGlitchActive) {
        globalGlitchDuration -= FRAME_DURATION
        if (globalGlitchDuration <= 0) {
          globalGlitchActive = false
          globalGlitchTimer = Math.random() * 40000 + 30000
        }
      }

      // Draw all cameras
      cameras.forEach((camera) => camera.draw(ctx, frameCount));
      
      // VCR effect
      drawVCREffect(ctx, canvas.width, canvas.height, frameCount);
      // Major system glitch
      if (globalGlitchActive) {
        drawMajorGlitch(ctx, canvas.width, canvas.height);
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // VCR effect overlay with more randomness
    const drawVCREffect = (ctx: CanvasRenderingContext2D, width: number, height: number, frameCount: number) => {
      // Scanlines with variable opacity
      const scanlineOpacity = Math.random() * 0.04 + 0.03 // Reduced opacity (was 0.05+0.05)
      ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`
      for (let y = 0; y < height; y += 4) {
        if (Math.random() > 0.1) {
          // Occasionally skip lines
          ctx.fillRect(0, y, width, 1)
        }
      }

      // Occasional horizontal glitch
      if (Math.random() > 0.995) {
        // Much less frequent (was 0.99)
        const y = Math.random() * height
        const glitchHeight = Math.random() * 10 + 2
        const opacity = Math.random() * 0.15 + 0.05
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fillRect(0, y, width, glitchHeight)
      }

      // VHS tracking lines with variable intensity
      if (Math.random() > 0.997) {
        // Much less frequent (was 0.995)
        const y = Math.random() * height
        const trackingHeight = Math.random() * 30 + 10
        const opacity = Math.random() * 0.3 + 0.1
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(0, y, width, trackingHeight)
      }

      // Color bleeding effect occasionally
      if (Math.random() > 0.997) {
        // Much less frequent (was 0.995)
        const colorChoice = Math.floor(Math.random() * 3)
        let color = "rgba(255, 0, 0, 0.03)" // Red by default

        if (colorChoice === 1)
          color = "rgba(0, 255, 0, 0.03)" // Green
        else if (colorChoice === 2) color = "rgba(0, 0, 255, 0.03)" // Blue

        ctx.fillStyle = color
        ctx.fillRect(0, 0, width, height)
      }

      // Rolling static bar - less frequent
      if (frameCount % 300 < 20 && Math.random() > 0.7) {
        // Less frequent (was 200<30 and 0.5)
        const y = (frameCount * 3) % height // Slower movement (was *5)
        const barHeight = Math.random() * 20 + 5
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
        ctx.fillRect(0, y, width, barHeight)
      }
    }

    // Major system glitch effect
    const drawMajorGlitch = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Skip ALL effects in light mode - no exceptions
      if (isLightMode) return;

      // Screen tear effect
      const numTears = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < numTears; i++) {
        const y = Math.floor(Math.random() * height)
        const tearHeight = Math.floor(Math.random() * 20) + 5
        const offset = Math.floor(Math.random() * 40) - 20

        try {
          const imageData = ctx.getImageData(0, y, width, tearHeight)
          ctx.clearRect(0, y, width, tearHeight)
          ctx.putImageData(imageData, offset, y)
        } catch (e) {
          console.error("Error in glitch effect:", e)
        }
      }

      // Color channel split
      if (Math.random() > 0.5) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.1)"
        ctx.fillRect(3, 0, width, height)

        ctx.fillStyle = "rgba(0, 255, 0, 0.1)"
        ctx.fillRect(-3, 0, width, height)

        ctx.fillStyle = "rgba(0, 0, 255, 0.1)"
        ctx.fillRect(0, 0, width, height)
      }

      // Random blocks of static
      const numBlocks = Math.floor(Math.random() * 8) + 3
      for (let i = 0; i < numBlocks; i++) {
        const blockWidth = Math.random() * 100 + 50
        const blockHeight = Math.random() * 100 + 50
        const x = Math.random() * (width - blockWidth)
        const y = Math.random() * (height - blockHeight)

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(x, y, blockWidth, blockHeight)

        // Add noise to the blocks
        const imageData = ctx.getImageData(x, y, blockWidth, blockHeight)
        const data = imageData.data

        for (let j = 0; j < data.length; j += 4) {
          const noise = Math.random() * 255
          data[j] = noise
          data[j + 1] = noise
          data[j + 2] = noise
          data[j + 3] = Math.random() * 255
        }

        ctx.putImageData(imageData, x, y)
      }
    }

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", initCameras)
    }
  }, [isLightMode])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
