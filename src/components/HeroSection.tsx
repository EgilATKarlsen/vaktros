import GlitchText from "@/components/glitch-text";
import WaitlistForm from "@/components/waitlist-form";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-32 container mx-auto px-4 relative">
      <div className="max-w-3xl">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 mb-4 border border-red-500 text-red-500 text-xs tracking-wider">
            NEXT GEN SECURITY
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <GlitchText>AI-Powered Surveillance</GlitchText>
            <GlitchText>For The Modern World</GlitchText>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Building the next generation of AI-enabled physical security products for real-time data collection in
            public safety and retail spaces.
          </p>
          <div className="relative">
            <WaitlistForm />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
} 