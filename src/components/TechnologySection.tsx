import GlitchText from "@/components/glitch-text";

export default function TechnologySection() {
  return (
    <section id="products" className="py-20 border-t border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <GlitchText>Our Technology</GlitchText>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-black/40 backdrop-blur-sm p-6 border border-white/10 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-3">Real-Time Analytics</h3>
            <p className="text-gray-400">
              Advanced AI algorithms process thousands of video streams simultaneously for instant threat detection.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 border border-white/10 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-3">Behavioral Prediction</h3>
            <p className="text-gray-400">
              Machine learning models that identify patterns and predict potential security incidents before they occur.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 border border-white/10 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-3">Secure Data Collection</h3>
            <p className="text-gray-400">
              Privacy-focused infrastructure for collecting and analyzing security data with military-grade encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 