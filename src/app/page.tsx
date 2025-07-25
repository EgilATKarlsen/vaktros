import CctvBackground from "@/components/cctv-background"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import RevolutionSection from "@/components/RevolutionSection"
import TeamSection from "@/components/TeamSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import Testimonials from "@/components/testimonials"
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <CctvBackground />
      </div>
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          {/* <TechnologySection /> */}
          <RevolutionSection />
          <Testimonials />
          {/* <SecurityFeaturesSlideshow /> */}
          <TeamSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
