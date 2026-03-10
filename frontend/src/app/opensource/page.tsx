"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ExternalLink, ArrowRight, GitPullRequest, Star, GitMerge, Zap, Code2, Globe, BookOpen } from "lucide-react";

function OpenSourceLandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-20">
      <div className="flex flex-col overflow-hidden bg-black">
        <ContainerScroll
          titleComponent={
            <h1 className="text-4xl font-semibold text-white text-center">
              DevTrack <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                OpenSource Tracker
              </span>
            </h1>
          }
        >
          <img
            src="/opensource.png"
            alt="opensource"
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full space-y-24 relative z-10 -mt-20">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-3xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-b from-white to-neutral-500 uppercase tracking-tighter leading-tight">
            Track Your Contribution <br className="hidden md:block" /> Legacy
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Every line of code you contribute to open source builds the future.
            Use our premium tracker to visualize your impact across the global ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => router.push("/opensource/track")}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
            >
              <span className="relative z-10">Start Tracking Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
            <button
              onClick={() => router.push("/opensource/docs")}
              className="group relative px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:bg-white/10 active:scale-95 flex items-center gap-3 text-lg backdrop-blur-sm"
            >
              <BookOpen className="w-5 h-5 text-violet-400" />
              <span className="relative z-10">Read the Guide</span>
            </button>
          </div>
        </div>

        {/* Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-20 border-t border-white/10">

          {/* Strategy Card */}
          <div className="relative group h-full">
            {/* Glow */}
            <div className="absolute -inset-0.5 bg-linear-to-br from-cyan-500 via-blue-500 to-violet-600 rounded-3xl blur-md opacity-20 group-hover:opacity-50 transition-all duration-700" />
            <div className="relative bg-[#040408] rounded-2xl border border-white/8 p-8 flex flex-col gap-6 h-full overflow-hidden">

              {/* Floating orb */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700" />

              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] mb-1">Best Practices</p>
                  <h3 className="text-xl font-bold text-white">Contribution Strategy</h3>
                </div>
              </div>

              {/* Body */}
              <p className="text-neutral-400 text-sm leading-relaxed">
                Focus on high-quality pull requests. Address issues labeled with{" "}
                <span className="text-cyan-400 font-semibold px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 whitespace-nowrap text-xs">"good first issue"</span>{" "}
                or{" "}
                <span className="text-blue-400 font-semibold px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 whitespace-nowrap text-xs">"help wanted"</span>{" "}
                to start your open source journey.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-auto">
                {[
                  { icon: <GitMerge className="w-4 h-4" />, label: "Merged PRs", color: "text-green-400" },
                  { icon: <Star className="w-4 h-4" />, label: "Stars Earned", color: "text-yellow-400" },
                  { icon: <Code2 className="w-4 h-4" />, label: "Repos", color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 bg-white/3 border border-white/8 rounded-xl p-3 hover:bg-white/6 transition-colors">
                    <span className={stat.color}>{stat.icon}</span>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest text-center font-bold">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA link */}
              <button
                onClick={() => router.push("/opensource/track")}
                className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group/cta mt-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Start Contributing
                <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quote Card */}
          <div className="relative group h-full">
            {/* Glow */}
            <div className="absolute -inset-0.5 bg-linear-to-br from-violet-600 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-20 group-hover:opacity-50 transition-all duration-700" />
            <div className="relative bg-[#040408] rounded-2xl border border-white/8 p-8 flex flex-col gap-6 h-full overflow-hidden items-center justify-center text-center">

              {/* Floating orbs */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-700" />

              {/* Quote mark */}
              <div className="text-7xl leading-none text-violet-500/30 font-serif select-none -mb-4 font-black">"</div>

              <h3 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-linear-to-br from-white via-violet-200 to-purple-400 italic leading-tight relative z-10">
                The best way to predict the future is to create it.
              </h3>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full max-w-xs">
                <div className="flex-1 h-px bg-linear-to-r from-transparent to-violet-500/30" />
                <Zap className="w-3.5 h-3.5 text-violet-500/60" />
                <div className="flex-1 h-px bg-linear-to-l from-transparent to-violet-500/30" />
              </div>

              <p className="text-neutral-500 text-xs uppercase tracking-[0.25em] relative z-10 max-w-xs leading-relaxed">
                Join millions of developers building the software that runs the world.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center mt-auto">
                {["Open Source", "Community", "Impact", "Innovation"].map((tag) => (
                  <span key={tag} className="text-[9px] text-violet-400/70 border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest hover:border-violet-500/40 hover:text-violet-400 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Globe icon accent */}
              <div className="absolute bottom-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Globe className="w-20 h-20 text-violet-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OpenSourceLandingPage;