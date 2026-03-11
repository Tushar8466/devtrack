"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { BoxesCore } from "./ui/background-boxes";
import { SparklesCore } from "./ui/sparkles";

export default function HeroSection() {
  const { data: session } = useSession();
  const nextRoute = session ? "/explore" : "/sign-in";

  return (
    <div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-black z-10 mask-[radial-gradient(transparent,white)] pointer-events-none transition-colors duration-300" />

        <BoxesCore />

        {/* Main Content foreground */}
        <div className="z-20 flex flex-col items-center gap-6 max-w-4xl mx-auto px-4 mt-[-5vh] text-center mix-blend-difference">
          <div className="px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-sm font-medium text-violet-300 inline-flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Introducing DevTrack Pro
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 ease-out fill-mode-both">
            Decode Developer <br className="hidden md:block" />
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">DNA & Influence</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 ease-out fill-mode-both">
            Seamlessly scan GitHub profiles to detect AI-generated code patterns, analyze post-merge stability, and gauge true software authorship confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 ease-out fill-mode-both">
            <Link
              href={nextRoute}
              className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-300 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              Start Scanning Now
            </Link>
            <Link
              href="/analyze/torvalds"
              className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              View Example Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
