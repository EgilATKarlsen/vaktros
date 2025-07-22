"use client"

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"
import GlitchText from "@/components/glitch-text"

const testimonials = [
  {
    name: "Sarah Chen",
    business: "NOVIG (YC S22)",
    type: "Sports Betting Platform",
    body: "VAKTROS's office infrastructure installation helped us meet regulatory compliance requirements for our sports betting platform. Their surveillance and network setup ensures we maintain proper oversight.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Mike Rodriguez",
    business: "Precision Aerospace Manufacturing",
    type: "Aerospace Manufacturing",
    body: "The integrated surveillance and network monitoring helps us maintain OSHA compliance and reduce liability risks on the factory floor. Critical for our defense contracts.",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emma Thompson",
    business: "Dime (YC W24)",
    type: "Healthcare Tech Startup",
    body: "VAKTROS secured our office space with HIPAA-compliant infrastructure. Their innovative installation approach got our healthcare tech operations running quickly while meeting strict regulatory requirements.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David Park",
    business: "Metropolitan Construction Group",
    type: "Construction Firm",
    body: "VAKTROS's surveillance data provided crucial documentation for our safety audit. Their system helped us identify and prevent potential workplace incidents before they occurred.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Martinez",
    business: "OpenCall (YC W24)",
    type: "Voice AI Startup",
    body: "They transformed our coworking space with smart network infrastructure and security monitoring. Perfect for our voice AI development needs with reliable connectivity and compliance features.",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "James Wilson",
    business: "Titan Manufacturing Solutions",
    type: "Industrial Manufacturing",
    body: "Their data-driven approach to workplace safety helped us reduce insurance premiums by 25%. The liability protection through comprehensive monitoring is invaluable.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Rachel Kim",
    business: "SuperOrder (YC S19)",
    type: "Restaurant Optimization",
    body: "VAKTROS secured our office space with comprehensive surveillance and network infrastructure. Essential for managing our restaurant review optimization platform with proper data protection.",
    img: "https://avatar.vercel.sh/rachel",
  },
  {
    name: "Tony Ricci",
    business: "Skyline Construction Partners",
    type: "Construction Firm",
    body: "The continued management of our job site security and network infrastructure lets us focus on building. Their compliance documentation saved us during a recent audit.",
    img: "https://avatar.vercel.sh/tony",
  },
  {
    name: "Amanda Foster",
    business: "Advanced Composites Manufacturing",
    type: "Aerospace Manufacturing",
    body: "VAKTROS's innovative approach to leveraging surveillance data for safety compliance is game-changing. We've eliminated workplace incidents through proactive monitoring.",
    img: "https://avatar.vercel.sh/amanda",
  },
  {
    name: "Carlos Mendez",
    business: "Ecliptor (YC W24)",
    type: "Document OCR Company",
    body: "They got our SF office operational fast with secure network and surveillance infrastructure. Perfect for our document OCR operations with the data security and compliance we need.",
    img: "https://avatar.vercel.sh/carlos",
  },
]

const firstRow = testimonials.slice(0, testimonials.length / 2)
const secondRow = testimonials.slice(testimonials.length / 2)

const TestimonialCard = ({
  name,
  business,
  type,
  body,
}: {
  name: string
  business: string
  type: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-5",
        "dark:border-white/10 border-black/10 dark:bg-black/40 bg-white/40 backdrop-blur-sm",
        "dark:hover:bg-black/60 hover:bg-white/60 transition-all duration-300",
        "dark:hover:border-red-500/30 hover:border-orange-600/30",
      )}
    >
      <div className="flex flex-col gap-0.5 mb-3">
        <figcaption className="text-sm font-semibold text-foreground">{name}</figcaption>
        <p className="text-xs text-muted-foreground">{business}</p>
        <p className="text-xs text-orange-600 dark:text-red-400 font-medium">{type}</p>
      </div>
      <blockquote className="text-sm text-muted-foreground leading-relaxed">&quot;{body}&quot;</blockquote>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 border-t dark:border-white/10 border-black/10 backdrop-blur-sm relative overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-center">
          <GlitchText>Trusted Across Industries</GlitchText>
        </h2>
        <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
          From Y Combinator startups to aerospace manufacturing and construction firms, see how VAKTROS delivers 
          workplace safety, regulatory compliance, and liability protection across diverse industries.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:80s] mb-4">
          {firstRow.map((testimonial, index) => (
            <TestimonialCard key={`first-${index}`} {...testimonial} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:80s]">
          {secondRow.map((testimonial, index) => (
            <TestimonialCard key={`second-${index}`} {...testimonial} />
          ))}
        </Marquee>

        {/* Gradient overlays for fade effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r dark:from-black dark:via-black/80 from-white via-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l dark:from-black dark:via-black/80 from-white via-white/80 to-transparent"></div>
      </div>

      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 dark:bg-red-500/5 bg-orange-600/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 dark:bg-red-500/5 bg-orange-600/5 blur-3xl rounded-full"></div>
    </section>
  )
}
