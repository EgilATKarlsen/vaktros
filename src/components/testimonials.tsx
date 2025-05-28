"use client"

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"
import GlitchText from "@/components/glitch-text"

const testimonials = [
  {
    name: "Sarah Chen",
    business: "Chen's Corner Market",
    type: "Grocery Store",
    body: "Vaktros helped us catch three shoplifters in the first week. The AI instantly flagged suspicious behavior that we would have missed. Our shrinkage is down 40%.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Mike Rodriguez",
    business: "Downtown Parking Solutions",
    type: "Parking Garage",
    body: "The system detected a break-in attempt at 2 AM and alerted security immediately. We prevented thousands in vehicle damage and caught the perpetrators.",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emma Thompson",
    business: "Brew & Bean Coffee",
    type: "Coffee Shop",
    body: "False alarms used to drive us crazy. Now we only get alerts for real threats. The AI knows the difference between a customer reaching for sugar and suspicious activity.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David Park",
    business: "Park Industries Warehouse",
    type: "Warehouse",
    body: "Vaktros provided crucial evidence for our insurance claim after equipment theft. The AI tracked the entire incident with perfect clarity. Saved us $50K.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Martinez",
    business: "QuickStop Convenience",
    type: "Convenience Store",
    body: "The behavioral prediction is incredible. It flagged someone acting suspicious 5 minutes before they attempted to steal. We intervened and prevented the theft entirely.",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "James Wilson",
    business: "Riverside Apartments",
    type: "Apartment Complex",
    body: "Package theft was a huge problem. Now the AI detects when someone lingers near mailboxes and alerts us instantly. Our residents feel much safer.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Rachel Kim",
    business: "Metro Office Plaza",
    type: "Office Building",
    body: "The system integrates perfectly with our existing cameras. We upgraded our entire security posture without replacing any hardware. ROI was immediate.",
    img: "https://avatar.vercel.sh/rachel",
  },
  {
    name: "Tony Ricci",
    business: "Ricci's Family Market",
    type: "Grocery Store",
    body: "Caught organized retail crime that was costing us hundreds weekly. The AI identified patterns we never would have seen. These criminals are now behind bars.",
    img: "https://avatar.vercel.sh/tony",
  },
  {
    name: "Amanda Foster",
    business: "Foster Storage Solutions",
    type: "Warehouse",
    body: "After a break-in, Vaktros provided HD evidence that led to arrests and full recovery of stolen goods. The insurance company was amazed by the video quality.",
    img: "https://avatar.vercel.sh/amanda",
  },
  {
    name: "Carlos Mendez",
    business: "24/7 Express Mart",
    type: "Convenience Store",
    body: "Night shift safety was our biggest concern. Now the AI watches everything and alerts us to any unusual activity. Our employees feel protected around the clock.",
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
          <GlitchText>Trusted by Business Owners</GlitchText>
        </h2>
        <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
          From corner stores to office complexes, see how Vaktros is helping businesses protect what matters most.
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
