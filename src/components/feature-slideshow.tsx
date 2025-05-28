"use client"

import { ShieldCheck, Eye, Zap, BarChart4, Lock, Cpu } from "lucide-react"
import GlitchText from "@/components/glitch-text"
import Slideshow, { type SlideData } from "@/components/ui/slideshow"

const securityFeatures: SlideData[] = [
  {
    id: "false-alarms",
    icon: ShieldCheck,
    title: "95% Reduction in False Alarms",
    description:
      "Advanced pattern recognition algorithms filter out non-threatening movements, dramatically reducing false positives that plague traditional systems.",
    image: "/globe.svg?height=400&width=600",
    stats: "95% accuracy improvement",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    id: "threat-detection",
    icon: Eye,
    title: "Proactive Threat Detection",
    description:
      "Identify suspicious behavior patterns before incidents occur, allowing security personnel to intervene at the earliest possible moment.",
    image: "/globe.svg?height=400&width=600",
    stats: "3-5 minutes early warning",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "real-time",
    icon: Zap,
    title: "Real-Time Processing",
    description:
      "Process thousands of video streams simultaneously with sub-millisecond latency, enabling immediate response to security events.",
    image: "/globe.svg?height=400&width=600",
    stats: "<100ms response time",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
  },
  {
    id: "analytics",
    icon: BarChart4,
    title: "Actionable Analytics",
    description:
      "Transform raw surveillance data into meaningful insights with customizable dashboards and automated reporting.",
    image: "/globe.svg?height=400&width=600",
    stats: "24/7 automated reports",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  {
    id: "security",
    icon: Lock,
    title: "Enterprise-Grade Security",
    description:
      "End-to-end encryption and robust access controls ensure your surveillance data remains protected at all times.",
    image: "/globe.svg?height=400&width=600",
    stats: "Military-grade encryption",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
  },
  {
    id: "integration",
    icon: Cpu,
    title: "Seamless Integration",
    description:
      "Works with your existing camera infrastructure and security systems, eliminating the need for costly hardware replacements.",
    image: "/globe.svg?height=400&width=600",
    stats: "99% compatibility rate",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
]

export default function SecurityFeaturesSlideshow() {
  const cctvImageOverlay = (slide: SlideData) => {
    const Icon = slide.icon!

    return (
      <div className="absolute inset-0 bg-black/20">
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-green-400/30" style={{ top: `${(i + 1) * 5}%` }} />
          ))}
        </div>

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400/60" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400/60" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400/60" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400/60" />

        {/* Recording indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1 rounded">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-400 font-mono">REC</span>
        </div>

        {/* Feature highlight box */}
        <div className="absolute bottom-6 left-6 right-6 bg-black/60 border border-white/20 rounded p-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${slide.color}`} />
            <span className="text-sm font-mono font-bold text-white">{slide.stats}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <GlitchText>Revolutionizing Physical Security</GlitchText>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 text-center max-w-4xl mx-auto">
          Our proprietary AI models analyze video feeds in milliseconds, identifying potential threats and anomalies
          faster than human operators could ever achieve.
        </p>

        <Slideshow
          slides={securityFeatures}
          autoPlay={true}
          interval={5000}
          imageOverlay={cctvImageOverlay}
          contentSide="right"
        />
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  )
}
