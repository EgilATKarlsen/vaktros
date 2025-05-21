import CctvBackground from "@/components/cctv-background"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import TechnologySection from "@/components/TechnologySection"
import RevolutionSection from "@/components/RevolutionSection"
import TeamSection from "@/components/TeamSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <CctvBackground />
      </div>
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          {/* <TechnologySection /> */}
          <RevolutionSection />
          <TeamSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
