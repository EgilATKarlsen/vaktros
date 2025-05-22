"use client";

import { useState, useEffect } from "react";
import GlitchText from "@/components/glitch-text";
import WaitlistForm from "@/components/waitlist-form";

// Component to handle video support detection
function VideoContainer() {
  const [videoSupported, setVideoSupported] = useState(true);

  useEffect(() => {
    // Check if video is supported
    const video = document.createElement('video');
    setVideoSupported(!!video.canPlayType);
  }, []);

  if (!videoSupported) return null;

  return (
    <div className="w-full md:w-1/2 relative">
      <div className="absolute inset-0 -m-4 bg-black/40 backdrop-blur-xl rounded-[30px]"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-zinc-900/80 to-black/60 backdrop-blur-md rounded-[20px]"></div>
      <div className="relative rounded-lg overflow-hidden">
        <video
          className="w-full object-cover min-h-[250px] md:min-h-[350px] mix-blend-lighten opacity-90"
          autoPlay
          muted
          loop
          playsInline
        >
          <source 
            src="https://res.cloudinary.com/dicxybkyc/video/upload/v1/tureymyv4fwx3quxwlic" 
            type="video/mp4" 
          />
        </video>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="py-20 md:py-32 container mx-auto px-4 relative">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div className="max-w-3xl md:w-1/2">
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
        <VideoContainer />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
} 