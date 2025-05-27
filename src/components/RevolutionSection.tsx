import GlitchText from "@/components/glitch-text";
import { MessageCircleWarning, Eye, Zap, BarChart4, Lock, Cpu } from "lucide-react";

export default function RevolutionSection() {
  return (
    <section id="revolution" className="py-20 relative overflow-hidden border-t border-white/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <GlitchText>Revolutionizing Physical Security</GlitchText>
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-300 mb-10 text-center">
            Our proprietary AI models analyze video feeds in milliseconds, identifying potential threats and anomalies faster than human operators could ever achieve.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <MessageCircleWarning className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Instant Alert Notifications</h3>
                  <p className="text-gray-400">Receive real-time text, push, and email notifications for security events, ensuring critical incidents are never missed regardless of where you are.</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Proactive Threat Detection</h3>
                  <p className="text-gray-400">Identify suspicious behavior patterns before incidents occur, allowing security personnel to intervene at the earliest possible moment.</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Processing</h3>
                  <p className="text-gray-400">Process thousands of video streams simultaneously with sub-millisecond latency, enabling immediate response to security events.</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <BarChart4 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Actionable Analytics</h3>
                  <p className="text-gray-400">Transform raw surveillance data into meaningful insights with customizable dashboards and automated reporting.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
                  <p className="text-gray-400">End-to-end encryption and robust access controls ensure your surveillance data remains protected at all times.</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                  <p className="text-gray-400">Works with your existing camera infrastructure and security systems, eliminating the need for costly hardware replacements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
} 