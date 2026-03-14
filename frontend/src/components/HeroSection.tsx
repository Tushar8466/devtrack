"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { BoxesCore } from "./ui/background-boxes";
import { ChevronRight, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const { data: session } = useSession();
  const nextRoute = session ? "/explore" : "/sign-in";

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-black z-0">
        <BoxesCore />
        {/* Only a very subtle grid for texture, no blur or dark wash */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none opacity-10" />
      </div>
      
      {/* Ambient Glow - kept minimal to avoid washing out boxes */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.05),transparent_60%)] z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 pt-20 pb-12 flex flex-col items-center text-center">
        {/* Release Badge */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <Link 
            href="/pulse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/3 hover:bg-white/8 transition-all text-sm font-medium text-white group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            <span className="text-neutral-400">DevTrack v4.2:</span>
            <span>Unveiling Pulse Hub</span>
            <ChevronRight size={14} className="text-neutral-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">
          Engineering Intelligence <br />
          <span className="bg-linear-to-b from-white via-white to-white/40 bg-clip-text text-transparent italic">Beyond the Surface.</span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-lg md:text-xl text-neutral-500 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 ease-out fill-mode-both">
          Sequence developer genetics, track high-velocity open source nodes, and verify authorship integrity with our autonomous intelligence engine.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 ease-out fill-mode-both">
          <Link
            href={nextRoute}
            className="h-14 px-10 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] active:scale-95 group"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/projects"
            className="h-14 px-10 rounded-2xl border border-white/10 bg-white/2 hover:bg-white/8 text-white font-bold flex items-center justify-center transition-all active:scale-95"
          >
            Explore Registry
          </Link>
        </div>

        {/* Enterprise Trust Micro-Section */}
        <div className="w-full max-w-7xl animate-in fade-in duration-1000 delay-700 ease-out fill-mode-both">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Built for modern engineering teams</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2 text-white font-black italic text-xl tracking-tighter">
                    <ShieldCheck className="text-violet-500 w-5 h-5" />
                    SECURE_NODE
                </div>
                <div className="flex items-center gap-2 text-white font-black italic text-xl tracking-tighter">
                    <Zap className="text-amber-500 w-5 h-5" />
                    ACCELERATE
                </div>
                <div className="flex items-center gap-2 text-white font-black italic text-xl tracking-tighter">
                    <div className="w-5 h-5 bg-white/20 rounded-full" />
                    LUMINA_LABS
                </div>
                <div className="flex items-center gap-2 text-white font-black italic text-xl tracking-tighter">
                    <div className="w-5 h-2 bg-white/20 rounded-sm" />
                    ORBIT_TECH
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
