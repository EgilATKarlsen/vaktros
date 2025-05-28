import GlitchText from "@/components/glitch-text";
import WaitlistForm from "@/components/waitlist-form";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          <GlitchText>Ready to transform your security?</GlitchText>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Request a personalized demo and see how our AI-powered security system can revolutionize your surveillance infrastructure.
        </p>
        <div className="relative max-w-md mx-auto">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
} 