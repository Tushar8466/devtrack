"use client";

import { useSession } from "next-auth/react";
import HeroSection from "@/components/HeroSection";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import AnimatedDevTrackScreen from "@/components/ui/AnimatedDevTrackScreen";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Search, Brain, BarChart, User, Settings, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { IntelligenceGrid } from "@/components/IntelligenceGrid";
import { Vortex } from "@/components/ui/vortex";

const Globe = dynamic(() => import("@/components/globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-black/20">
      <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    </div>
  ),
});

const SpecialEcosystem = dynamic(() => import("@/components/special"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-black/20">
      <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  ),
});

const Icon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  );
};

const features = [
  { icon: <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" strokeWidth={1.5} /> },
  { icon: <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" strokeWidth={1.5} /> },
  { icon: <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" strokeWidth={1.5} /> },
  { icon: <User className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" strokeWidth={1.5} /> },
  { icon: <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" strokeWidth={1.5} /> },
  { icon: <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-500" strokeWidth={1.5} /> },
];

export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />

      {/* MacBook Scroll section - Text Removed */}
      <div className="overflow-hidden bg-black w-full">
        <MacbookScroll
          title={null}
          screenContent={<AnimatedDevTrackScreen />}
          showGradient={false}
        />
      </div>

      {/* Intelligence Grid Section - Text Removed */}
      <section className="bg-black py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <IntelligenceGrid />
        </div>
      </section>

      {/* Features section - Text Removed */}
      <section className="bg-black py-24 px-6">
        <div className="relative z-20 w-full mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-white/10 flex flex-col items-start p-4 relative h-[24rem] bg-black/60 backdrop-blur-md rounded-2xl group"
              >
                <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />
                <div className="w-full h-full flex items-center justify-center">
                  <EvervaultCard text={feature.icon} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Neural Section with Vortex - Text Removed */}
      <section className="bg-black relative overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseSpeed={0.5}
          baseHue={280}
          containerClassName="min-h-[800px] py-24 px-6"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-center">
              <div className="h-[600px] w-full max-w-4xl relative">
                <SpecialEcosystem />
              </div>
            </div>
          </div>
        </Vortex>
      </section>

      {/* Architecture Visual - Text Removed */}
      <section className="bg-black py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <BackgroundRippleEffect rows={20} cols={40} cellSize={60} />
        </div>
      </section>

      {/* Global Interactive Section - Text Removed */}
      <section id="global-map" className="bg-black py-24 px-6 overflow-hidden relative min-h-[800px] flex flex-col items-center">
        <div className="w-full max-w-6xl h-[600px] md:h-[800px] relative z-10 bg-black border border-indigo-500/10 rounded-[3rem] p-1 backdrop-blur-sm">
          <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
            <Globe />
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-black py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-xs">© 2026 DevTrack.</p>
        </div>
      </footer>
    </div>
  );
}