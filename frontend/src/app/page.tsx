"use client";

import HeroSection from "@/components/HeroSection";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import AnimatedDevTrackScreen from "@/components/ui/AnimatedDevTrackScreen";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Search, Brain, BarChart, User, Settings, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { IntelligenceGrid } from "@/components/IntelligenceGrid";
import { Vortex } from "@/components/ui/vortex";
import { FeedbackWall } from "@/components/FeedbackWall";
import { FeedbackForm } from "@/components/FeedbackForm";
import { motion } from "motion/react";

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
  { 
    title: "AI Detection Pulse", 
    description: "Real-time analysis to identify synthetic code patterns with ultra-high accuracy.",
    icon: <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" strokeWidth={1.5} /> 
  },
  { 
    title: "Neural Authorship", 
    description: "Map unique developer signatures using deep learning across billions of tokens.",
    icon: <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" strokeWidth={1.5} /> 
  },
  { 
    title: "Evolutionary Metrics", 
    description: "Track the growth and impact of high-dimensional codebases over time.",
    icon: <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" strokeWidth={1.5} /> 
  },
  { 
    title: "Identity Verification", 
    description: "Authenticate the true source of engineering talent across global repos.",
    icon: <User className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" strokeWidth={1.5} /> 
  },
  { 
    title: "Node Integration", 
    description: "Seamlessly connect and analyze any GitHub node or private repository.",
    icon: <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" strokeWidth={1.5} /> 
  },
  { 
    title: "Secure Processing", 
    description: "Privacy-first architecture where code remains ephemeral and protected.",
    icon: <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-500" strokeWidth={1.5} /> 
  },
];

const steps = [
  { id: "01", title: "Initialize Sync", desc: "Connect your GitHub account or search any public node." },
  { id: "02", title: "Neural Scan", desc: "Our engine deconstructs authorship patterns in seconds." },
  { id: "03", title: "Extract DNA", desc: "Receive a comprehensive report on code provenance." }
];

export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />

      {/* MacBook Scroll section */}
      <div className="overflow-hidden bg-black w-full pb-20">
        <MacbookScroll
          title={
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter"
            >
              Command Your <span className="text-violet-500">Workspace</span>
            </motion.h2>
          }
          screenContent={<AnimatedDevTrackScreen />}
          showGradient={false}
        />
      </div>

      {/* Intelligence Grid Section */}
      <section className="bg-black py-24 px-6 relative overflow-hidden border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 text-center">
             <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                Neural <span className="text-violet-500">Core</span> Capabilities
              </h2>
              <p className="text-neutral-500 mt-4 max-w-xl mx-auto font-medium">
                Leveraging high-dimensional vector analysis to authenticate the true source of engineering talent.
              </p>
          </div>
          <IntelligenceGrid />
        </div>
      </section>

      {/* Features section */}
      <section className="bg-black py-24 px-6 border-t border-white/5">
        <div className="relative z-20 w-full mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Tactical Modular Features</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto italic font-medium">Equipping developers with the intelligence to ensure code integrity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-white/10 flex flex-col items-start p-4 relative h-[32rem] bg-black/60 backdrop-blur-md rounded-3xl group transition-all hover:border-violet-500/50"
              >
                <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white/20" />
                
                <div className="w-full h-3/5 flex items-center justify-center">
                  <EvervaultCard text={feature.icon} />
                </div>
                
                <div className="mt-8 px-4 w-full">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-violet-400 transition-colors">{feature.title}</h3>
                  <p className="text-neutral-500 text-sm font-medium leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Neural Section with Vortex */}
      <section className="bg-black relative overflow-hidden border-t border-white/5">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseSpeed={0.5}
          baseHue={280}
          containerClassName="min-h-[800px] py-24 px-6"
        >
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <div className="text-center mb-16 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">Neural Distribution</h2>
              <p className="text-neutral-400 font-medium">Visualize the real-time processing of code genetics across our global distributed network.</p>
            </div>
            <div className="h-[600px] w-full max-w-4xl relative">
              <SpecialEcosystem />
            </div>
          </div>
        </Vortex>
      </section>

      {/* Architecture Visual */}
      <section className="bg-black py-32 px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-20">
          <BackgroundRippleEffect rows={20} cols={40} cellSize={60} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-violet-500/50 transition-all font-black text-2xl text-violet-500 italic">
                  {s.id}
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">{s.title}</h3>
                <p className="text-neutral-500 text-sm font-medium italic">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Interactive Section */}
      <section id="global-map" className="bg-black py-24 px-6 overflow-hidden relative min-h-[800px] flex flex-col items-center border-t border-white/5">
        <div className="max-w-3xl text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Global Integration Nodes</h2>
          <p className="text-neutral-500 font-medium italic underline decoration-violet-500/30 underline-offset-8">Synchronized across 40+ global repository clusters.</p>
        </div>
        <div className="w-full max-w-6xl h-[600px] md:h-[800px] relative z-10 bg-black border border-indigo-500/10 rounded-[4rem] p-1 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,1)]">
          <div className="w-full h-full rounded-[3.8rem] overflow-hidden">
            <Globe />
          </div>
        </div>
      </section>

      {/* Collective Intelligence & Feedback Section */}
      <section id="feedback" className="bg-black border-t border-white/5 relative overflow-hidden">
        <FeedbackWall />
        <div className="pb-32">
          <FeedbackForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="text-3xl font-black italic tracking-tighter text-white uppercase">DevTrack</span>
            <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Intelligence Systems © 2026.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {["Pulse", "DNA", "Nodes", "Privacy", "Terms"].map((item) => (
              <a key={item} href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-all hover:scale-110 active:scale-95">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}