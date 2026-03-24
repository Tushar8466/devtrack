"use client";

import HeroSection from "@/components/HeroSection";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Search, Brain, BarChart, User, Settings, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { IntelligenceGrid } from "@/components/IntelligenceGrid";
import { FeedbackWall } from "@/components/FeedbackWall";
import { FeedbackForm } from "@/components/FeedbackForm";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";

const Globe = dynamic(() => import("@/components/globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-black/20">
      <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
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
  const { data: session } = useSession();
  const nextRoute = session ? "/explore" : "/sign-in";

  return (
    <div className="bg-black">
      {/* GitHub Star Badge */}
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-5000"
      >
        <Link
          href="https://github.com/Tushar8466/devtrack"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-3 sm:px-5 sm:py-4 shadow-xl backdrop-blur-md transition-all hover:bg-white/10 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Star size={16} className="text-amber-500 fill-amber-500/20 group-hover:fill-amber-500/40 transition-all group-hover:rotate-12 sm:w-[18px] sm:h-[18px]" />
          <span className="hidden md:block uppercase tracking-widest text-[10px] font-black text-neutral-300 group-hover:text-white">
            Star on GitHub
          </span>
        </Link>
      </motion.div>


      <HeroSection />


      {/* Neural Nexus Teaser Section */}
      <section className="bg-black py-20 sm:py-24 px-6 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 sm:space-y-12">
          <div className="space-y-4">
            <span className="text-violet-500 font-black tracking-[0.4em] text-[9px] sm:text-[10px] animate-pulse uppercase">// COGNITIVE_EXPANSION_NODE</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">
              The DevTrack <span className="text-violet-500">AI</span>
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto italic font-medium text-base sm:text-lg px-4">
              Step into the high-dimensional visualization of global repository clusters. Analyze core authorship DNA with our neural engine.
            </p>
          </div>

          <Link
            href="/ai"
            className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-violet-600 text-white rounded-2xl font-black text-base sm:text-lg uppercase tracking-tighter hover:bg-violet-500 transition-all shadow-2xl shadow-violet-500/20 active:scale-95 group text-center"
          >
            Launch Intelligence Core
          </Link>
        </div>
      </section>

      {/* Intelligence Grid Section */}
      <Suspense fallback={<div className="h-96 bg-black" />}>
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
      </Suspense>

      {/* Features section */}
      <section className="bg-black py-20 sm:py-24 px-6 border-t border-white/5">
        <div className="relative z-20 w-full mx-auto max-w-7xl px-4 py-12 sm:py-24">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Tactical Modular Features</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto italic font-medium text-sm sm:text-base">Equipping developers with the intelligence to ensure code integrity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-white/10 flex flex-col items-start p-4 relative h-auto min-h-112 sm:h-128 bg-black/60 backdrop-blur-sm rounded-3xl group transition-all hover:border-violet-500/50"
              >
                <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white/20" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white/20" />

                <div className="w-full h-72 sm:h-3/5 flex items-center justify-center overflow-hidden">
                  <EvervaultCard text={feature.icon} className="scale-75 sm:scale-100" />
                </div>

                <div className="mt-6 sm:mt-8 px-4 w-full pb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-violet-400 transition-colors">{feature.title}</h3>
                  <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Architecture Visual */}
      <section className="bg-black py-20 sm:py-32 px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-20">
          <BackgroundRippleEffect rows={20} cols={40} cellSize={60} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 text-center">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center group bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-violet-500/50 transition-all font-black text-xl sm:text-2xl text-violet-500 italic">
                  {s.id}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-3">{s.title}</h3>
                <p className="text-neutral-500 text-sm font-medium italic">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA section */}
      <section className="bg-black py-20 sm:py-32 px-6 relative overflow-hidden group/cta border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-1000">
          <SparklesCore
            id="tsparticlescta"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#8b5cf6"
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tighter"
          >
            READY TO DECODE <br />
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">DEVELOPER DNA</span>?
          </motion.h2>
          <p className="text-neutral-500 text-base sm:text-lg mb-10 sm:mb-12 max-w-xl mx-auto font-medium italic px-4">
            Join thousands of developers using DevTrack to verify authorship and ensure code integrity in the age of AI.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Link
              href={nextRoute}
              className="w-full sm:w-auto inline-block px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-white text-black font-black text-base sm:text-lg transition-all duration-300 shadow-[0_0_50px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_70px_-5px_rgba(255,255,255,0.4)] uppercase tracking-tighter"
            >
              Start Scanning Now <ChevronRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contribute (Open Source Node) Section */}
      <section id="open-source-mission" className="bg-black py-20 sm:py-32 px-6 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">
          <div className="flex-1 space-y-8 sm:space-y-10 group order-2 lg:order-1 text-center lg:text-left">
            <div>
              <span className="text-violet-400 font-bold uppercase tracking-[0.3em] mb-4 inline-block text-[10px] sm:text-[11px] animate-pulse">// OPEN SOURCE INITIATIVE</span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                Be Part of the <br className="hidden md:block" />
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Evolution</span>
              </h2>
            </div>

            <p className="text-neutral-500 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 group-hover:text-neutral-400 transition-colors duration-500 italic font-medium px-4 sm:px-0">
              DevTrack is an open-source project aimed at creating a transparent, verifiable ecosystem for software authorship. Every line of our code is open for review and contribution.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-4 items-center justify-center lg:justify-start">
              <Link
                href="/contribute"
                prefetch={true}
                className="w-full sm:w-auto relative z-20 px-10 py-4 rounded-4xl bg-white text-black font-black hover:scale-105 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95 uppercase tracking-tighter text-center"
              >
                Contribute Now
              </Link>
              <a
                href="https://github.com/Tushar8466/devtrack"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-10 py-4 rounded-4xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all active:scale-95 uppercase tracking-tighter text-center"
              >
                GitHub Repo
              </a>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center relative group order-1 lg:order-2 mb-12 lg:mb-0">
            <div className="w-full aspect-square max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] border border-white/10 rounded-4xl sm:rounded-5xl bg-black relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden shadow-[0_0_50px_-12px_rgba(124,58,237,0.2)] hover:border-violet-500/50 transition-all duration-700">
              {/* Dynamic Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-violet-500/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out" />

              <div className="relative mb-6 sm:mb-8">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                  <div className="absolute inset-0 bg-violet-600/20 blur-3xl animate-pulse" />
                  <div className="absolute inset-0 border border-violet-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 border border-violet-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <Settings className="relative w-12 h-12 sm:w-16 sm:h-16 text-violet-500 group-hover:rotate-180 transition-transform duration-1000 ease-out" strokeWidth={1} />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Integration</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase leading-none">JOIN THE CORE</h4>
                <div className="text-neutral-500 text-[10px] sm:text-sm font-medium border-y border-white/5 py-4 px-4 sm:px-6 inline-block uppercase tracking-widest leading-loose">
                  <span className="text-violet-400 font-bold mr-2 animate-pulse">GROWING</span>
                  OPEN SOURCE MISSION
                </div>
              </div>

              <p className="mt-6 sm:mt-8 text-neutral-500 text-[10px] sm:text-xs italic font-mono leading-relaxed max-w-[240px] sm:max-w-[280px]">
                "Our mission is to help human ingenuity thrive in the age of synthetic code authorship."
              </p>

              {/* Decorative Corner Accents */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-white/10 group-hover:border-violet-500/50 transition-colors" />
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-white/10 group-hover:border-violet-500/50 transition-colors" />
            </div>

            {/* Outer Glows */}
            <div className="absolute -inset-4 bg-violet-500/5 blur-3xl rounded-5xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          </div>

          {/* Absolute decorative items */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/5 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-600/5 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Collective Intelligence & Feedback Section */}
      <section id="feedback" className="bg-black border-t border-white/5 relative overflow-hidden">
        <FeedbackWall />
        <div className="pb-32">
          <FeedbackForm />
        </div>
      </section>

      {/* Global Interactive Section & Satellite Interception Feed */}
      <Suspense fallback={<div className="h-[400px] sm:h-[600px] bg-black" />}>
        <section id="global-map" className="bg-black py-20 sm:py-24 px-6 overflow-hidden relative min-h-[700px] sm:min-h-[900px] flex flex-col items-center border-t border-white/5">
          <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-20 relative z-10 px-4">
            <span className="text-violet-500 font-black tracking-[0.4em] text-[9px] sm:text-[10px] animate-pulse mb-4 block">// SATELLITE_INTERCEPTION_FEED</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
              Global Integration <span className="text-violet-500">Nodes</span>
            </h2>
            <p className="text-neutral-500 font-medium italic underline decoration-violet-500/30 underline-offset-8 text-sm sm:text-base">
              Synchronized across 40+ global repository clusters. Real-time interception of development pulses.
            </p>
          </div>

          <div className="w-full max-w-7xl relative z-10">
            {/* Globe Visualization */}
            <div className="w-full h-[400px] sm:h-[600px] md:h-[800px] relative bg-black border border-indigo-500/10 rounded-4xl sm:rounded-4xl md:rounded-5xl p-0.5 sm:p-1 backdrop-blur-sm shadow-[0_0_80px_rgba(139,92,246,0.1)] group hover:border-violet-500/20 transition-all duration-700">
              <div className="w-full h-full rounded-4xl sm:rounded-4xl md:rounded-5xl overflow-hidden">
                <Globe />
              </div>
            </div>
          </div>
        </section>
      </Suspense>

      {/* Footer */}
      <footer className="bg-black py-16 sm:py-24 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-10">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white uppercase">DevTrack</span>
            <p className="text-neutral-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-center sm:text-left">Integrated Intelligence Systems © 2026.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-12">
            {["Pulse", "DNA", "Nodes", "Privacy", "Terms"].map((item) => (
              <a key={item} href="#" className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-all hover:scale-110 active:scale-95">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}