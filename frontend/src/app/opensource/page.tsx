"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ExternalLink, ArrowRight, GitPullRequest, Star, GitMerge, Zap, Code2, Globe, BookOpen, Search, Terminal, MessageSquare, Award, PlayCircle, Heart, Shield, Users } from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";

function OpenSourceLandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-20 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Neural Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
      </div>

      {/* Tactical OS Pulse Ticker */}
      <div className="w-full bg-cyan-950/20 border-b border-white/5 py-2 overflow-hidden relative z-50">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[
            "// REPO_DETECTION: facebook/react | SAT_STABLE",
            "// NODE_UPDATE: vercel/next.js | NEW_RELEASE v14.1",
            "// TRAFFIC_SPIKE: apple/swift | 1.2k NODES_JOINED",
            "// UPLINK_ESTABLISHED: microsoft/vscode | SYNC_COMPLETE",
            "// ANOMALY_DETECTED: bun/sh | VELOCITY_CRITICAL",
            "// SECTOR_SCAN: tailwindlabs/tailwindcss | HEALTH_OPTIMAL"
          ].map((text, i) => (
            <span key={i} className="text-[10px] font-mono font-black text-cyan-500/80 uppercase tracking-widest">{text}</span>
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col overflow-hidden bg-black relative">
        <ContainerScroll
          titleComponent={
            <h1 className="text-4xl font-semibold text-white text-center flex flex-col items-center gap-4">
              <img src="/logo/devtrack-logo.png" alt="DevTrack Logo" className="w-16 h-16 animate-pulse" />
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
            className="mx-auto rounded-2xl object-cover h-full object-top-left"
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
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
            >
              <span className="relative z-10">Contribution Tracker</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/opensource/explorer")}
              className="group relative px-10 py-5 bg-cyan-500 text-black font-bold rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span className="relative z-10">Node Intelligence</span>
            </button>
            <button
              onClick={() => router.push("/opensource/docs")}
              className="group relative px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:bg-white/10 active:scale-95 flex items-center gap-3 text-lg backdrop-blur-sm"
            >
              <BookOpen className="w-5 h-5 text-violet-400" />
              <span className="relative z-10">Guide</span>
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
                className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors group/cta mt-2"
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

        {/* How It Works Section */}
        <section className="py-20 border-t border-white/10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">The Journey to Your First PR</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Open source can be intimidating. We break it down into simple, actionable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Find", desc: "Search for 'good first issues' in repos you love.", icon: <Search className="w-6 h-6" />, color: "amber" },
              { step: "02", title: "Fork", desc: "Create your own copy of the repository to work in.", icon: <GitMerge className="w-6 h-6" />, color: "blue" },
              { step: "03", title: "Code", desc: "Implement your fix or feature and run tests.", icon: <Terminal className="w-6 h-6" />, color: "emerald" },
              { step: "04", title: "Merge", desc: "Open a PR and collaborate with maintainers.", icon: <Star className="w-6 h-6" />, color: "rose" },
            ].map((item, i) => (
              <div key={i} className={`relative p-8 rounded-3xl bg-white/5 border transition-all group overflow-hidden ${item.color === "amber" ? "hover:bg-amber-500/5 border-white/5 hover:border-amber-500/20" :
                item.color === "blue" ? "hover:bg-blue-500/5 border-white/5 hover:border-blue-500/20" :
                  item.color === "emerald" ? "hover:bg-emerald-500/5 border-white/5 hover:border-emerald-500/20" :
                    "hover:bg-rose-500/5 border-white/5 hover:border-rose-500/20"
                }`}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${item.color === "amber" ? "bg-amber-500" :
                  item.color === "blue" ? "bg-blue-500" :
                    item.color === "emerald" ? "bg-emerald-500" :
                      "bg-rose-500"
                  }`} />
                <span className="absolute top-4 right-6 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors uppercase">{item.step}</span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${item.color === "amber" ? "bg-amber-500/10 text-amber-500 group-hover:scale-110" :
                  item.color === "blue" ? "bg-blue-500/10 text-blue-500 group-hover:scale-110" :
                    item.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 group-hover:scale-110" :
                      "bg-rose-500/10 text-rose-500 group-hover:scale-110"
                  }`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contribution Types with GlareCard */}
        <section className="py-20 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Choose Your Path</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Every contribution counts, whether it's code, documentation, or community support.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <GlareCard className="flex flex-col items-start justify-end p-8 pb-12 overflow-hidden bg-slate-950">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-950/20 to-cyan-950/40 z-10" />
              <div className="relative z-20 space-y-4">
                <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 w-fit text-cyan-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">The Architect</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Build new features, optimize performance, and solve complex technical challenges.
                </p>
                <div className="flex gap-2">
                  {["Advanced", "Logic", "Scalability"].map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-cyan-500/5 rounded-full text-cyan-500/70 border border-cyan-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            </GlareCard>

            <GlareCard className="flex flex-col items-start justify-end p-8 pb-12 overflow-hidden bg-slate-950">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-950/20 to-violet-950/40 z-10" />
              <div className="relative z-20 space-y-4">
                <div className="p-3 bg-violet-500/20 rounded-2xl border border-violet-500/30 w-fit text-violet-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">The Educator</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Improve documentation, write guides, and help others understand the codebase.
                </p>
                <div className="flex gap-2">
                  {["Clarity", "Onboarding", "Docs"].map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-violet-500/5 rounded-full text-violet-500/70 border border-violet-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            </GlareCard>

            <GlareCard className="flex flex-col items-start justify-end p-8 pb-12 overflow-hidden bg-slate-950">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-950/20 to-emerald-950/40 z-10" />
              <div className="relative z-20 space-y-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 w-fit text-emerald-400">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">The Guardian</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Fix bugs, secure the codebase, and maintain the health of the project ecosystem.
                </p>
                <div className="flex gap-2">
                  {["Security", "Reliability", "Fixes"].map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/5 rounded-full text-emerald-500/70 border border-emerald-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            </GlareCard>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-20 bg-white/2 rounded-[3rem] border border-white/5 px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Contributors", value: "85k+", icon: <Users className="w-5 h-5 text-blue-400" /> },
              { label: "Analyzed Commits", value: "1.2M", icon: <GitMerge className="w-5 h-5 text-purple-400" /> },
              { label: "Tracked Projects", value: "12k+", icon: <Shield className="w-5 h-5 text-emerald-400" /> },
              { label: "Community Rep", value: "Gold", icon: <Award className="w-5 h-5 text-yellow-400" /> },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="mx-auto w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ASSETS LEADERBOARD */}
        <section className="py-20 space-y-16 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Tactical Asset Registry</h2>
               <p className="text-neutral-500 max-w-xl font-mono text-[10px] uppercase tracking-[0.4em]">High-Velocity_Global_Nodes</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Scanning_Live...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { name: "React_Core", path: "facebook/react", stats: "14.2k NODES", health: "98.4%", icon: "⚛️" },
                { name: "Next_Intelligence", path: "vercel/next.js", stats: "8.5k NODES", health: "99.1%", icon: "▲" },
                { name: "Bun_Runtime", path: "oven-sh/bun", stats: "6.1k NODES", health: "94.2%", icon: "🍔" },
                { name: "VS_Satellite", path: "microsoft/vscode", stats: "32.4k NODES", health: "97.8%", icon: "💻" },
                { name: "Three_Matrix", path: "mrdoob/three.js", stats: "4.8k NODES", health: "92.1%", icon: "🧱" },
                { name: "Tailwind_Lattice", path: "tailwindlabs/tailwindcss", stats: "11.2k NODES", health: "99.8%", icon: "🌊" }
            ].map((asset, i) => (
                <div key={i} className="group relative bg-[#040408] rounded-4xl border border-white/5 p-8 overflow-hidden hover:border-cyan-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-5xl">{asset.icon}</div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">ASSET_ID_00{i+1}</span>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{asset.name}</h3>
                            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-tight">{asset.path}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Spectral_Density</p>
                                <p className="text-sm font-black text-white">{asset.stats}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Integrity</p>
                                <p className="text-sm font-black text-emerald-500 italic">{asset.health}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => router.push(`/opensource/explorer?q=${asset.path}`)}
                            className="w-full py-3 bg-white/2 border border-white/5 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all active:scale-95"
                        >
                            Intercept Node Telemetry
                        </button>
                    </div>
                </div>
            ))}
          </div>
        </section>

        {/* Final Footnote CTA */}
        <section className="py-32 text-center space-y-12">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-full" />
            <h2 className="relative text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Start Your <br /> Story Today
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/opensource/track")}
              className="group px-12 py-6 bg-white text-black font-black rounded-4xl cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-xl"
            >
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/opensource/docs")}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-4xl cursor-pointer hover:bg-white/10 transition-all text-xl backdrop-blur-xl"
            >
              Read Documentation
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OpenSourceLandingPage;