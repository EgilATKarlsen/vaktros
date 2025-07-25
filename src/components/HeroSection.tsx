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
      <div className="absolute inset-0 -m-4 bg-background/40 backdrop-blur-xl rounded-[30px]"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-muted/80 to-background/60 backdrop-blur-md rounded-[20px]"></div>
      <div className="relative rounded-lg overflow-hidden">
        <video
          className="w-full object-cover min-h-[250px] md:min-h-[350px] dark:mix-blend-lighten mix-blend-darken dark:opacity-90 opacity-80"
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
            <div className="inline-block px-3 py-1 mb-4 border dark:border-red-500/30 border-orange-600/30 dark:text-red-400 text-orange-600 text-xs tracking-wider">
              NEXT GEN MSP
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <GlitchText>Physical & Digital</GlitchText>
              <GlitchText>Security Services</GlitchText>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Serving offices, manufacturing, construction, and other industries with innovative installation and 
              continued management. We leverage network and surveillance data to improve workplace safety from 
              regulatory, liability, and compliance perspectives.
            </p>
            <div className="relative">
              <WaitlistForm />
            </div>
          </div>
        </div>
        <VideoContainer />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 dark:bg-red-500/10 bg-orange-600/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
} 