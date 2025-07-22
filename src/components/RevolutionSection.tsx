import GlitchText from "@/components/glitch-text";
import { Network, Zap, Wrench, BarChart4, Shield, Cpu } from "lucide-react";

export default function RevolutionSection() {
  return (
    <section id="revolution" className="py-20 relative overflow-hidden border-t border-border/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <GlitchText>Revolutionizing IT Operations</GlitchText>
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground mb-10 text-center">
            We serve offices, manufacturing, construction, and other industries with innovative installation and 
            continued management. Our novel approach leverages network and surveillance data to improve workplace 
            safety from regulatory, liability, and compliance perspectives.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovative Installation</h3>
                  <p className="text-muted-foreground">Direct installation approach across offices, manufacturing, and construction sites with rapid deployment and continued management services.</p>
                </div>
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Network className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Data-Driven Safety</h3>
                  <p className="text-muted-foreground">Leverage network and surveillance data to identify safety risks, ensure regulatory compliance, and reduce liability exposure across your operations.</p>
                </div>
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Regulatory Compliance</h3>
                  <p className="text-muted-foreground">Ensure workplace safety standards and regulatory requirements are met through continuous monitoring and data analysis across all industry sectors.</p>
                </div>
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <BarChart4 className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Liability Protection</h3>
                  <p className="text-muted-foreground">Reduce liability risks through comprehensive surveillance and network monitoring that provides documentation and insights for workplace incidents.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Wrench className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Continued Management</h3>
                  <p className="text-muted-foreground">Ongoing maintenance and optimization of your security and network infrastructure across manufacturing, construction, and office environments.</p>
                </div>
              </div>
            </div>
            <div className="bg-card/30 backdrop-blur-sm p-6 border border-border/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="h-5 w-5 text-orange-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Multi-Industry Expertise</h3>
                  <p className="text-muted-foreground">Proven experience across diverse sectors including Y Combinator portfolio companies, with tailored solutions for each industry&apos;s unique safety and compliance needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-600/5 dark:bg-red-500/5 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 dark:bg-red-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
} 