"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Zap, 
  Globe, 
  TrendingUp, 
  Star, 
  GitFork, 
  Terminal,
  Cpu,
  ShieldAlert,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface TrendingRepo {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  owner: {
    avatar_url: string;
  };
}

export default function PulsePage() {
  const [trending, setTrending] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"global" | "anomalies" | "uplinks">("global");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/github/trending");
        if (res.ok) {
          const data = await res.json();
          setTrending(data.repos || []);
        }
      } catch (err) {
        console.error("Pulse sync failure", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <BackgroundBeams className="opacity-30" />
      
      {/* Cinematic HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-black via-black/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black via-black/80 to-transparent" />
        
        {/* Corners */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-fit"
            >
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Global_Frequency_Monitored</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none"
            >
              Neural <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">Pulse</span>
            </motion.h1>
            <p className="text-neutral-500 max-w-xl font-mono text-xs uppercase tracking-[0.3em]">
              Real-time synchronization with the global open-source architectural matrix.
            </p>
          </div>

          <div className="flex gap-4">
            {[
              { id: "global", label: "Global Feed", icon: Globe },
              { id: "anomalies", label: "Anomaly Detection", icon: ShieldAlert },
              { id: "uplinks", label: "Active Uplinks", icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3",
                  activeTab === tab.id 
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "bg-white/5 text-neutral-500 border-white/5 hover:border-white/10 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Trending Nodes */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">High-Velocity Nodes</h2>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-white/5 rounded-4xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {trending.map((repo, i) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative bg-[#040408] border border-white/5 rounded-4xl p-8 overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer"
                      onClick={() => window.open(repo.html_url, '_blank')}
                    >
                      {/* Grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none opacity-20" />
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <img src={repo.owner.avatar_url} className="w-12 h-12 rounded-2xl border border-white/10" alt="" />
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-black text-white tabular-nums">{repo.stargazers_count}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight italic group-hover:text-cyan-400 transition-colors">
                            {repo.full_name.split('/')[1]}
                          </h3>
                          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest leading-relaxed line-clamp-2">
                            {repo.description || "NO_DESCRIPTION_PROVIDED_BY_NODE"}
                          </p>
                        </div>

                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Synchronizing</span>
                          </div>
                          <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">HEALTH: 99.8%</span>
                        </div>
                      </div>

                      {/* Hover Scanline */}
                      <motion.div 
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-40 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right: Spectral Analysis & Feed */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Tactical Feed</h2>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-4xl p-8 h-[700px] flex flex-col relative overflow-hidden">
               {/* Feed content */}
               <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  {[
                    { node: "NEXT_INTEL", action: "DEPLOY_SYNC", status: "STABLE", color: "text-emerald-500" },
                    { node: "REACT_CORE", action: "NEURAL_MERGE", status: "OPTIMIZING", color: "text-blue-500" },
                    { node: "BUN_UPTIME", action: "PACKET_DRIFT", status: "ANOMALY", color: "text-rose-500" },
                    { node: "VS_SCANNER", action: "SECTOR_SYNC", status: "HEALTHY", color: "text-cyan-500" },
                    { node: "THREE_MAT", action: "RENDER_LINK", status: "ACTIVE", color: "text-violet-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group/item">
                       <div className="w-px h-12 bg-white/10 group-hover/item:bg-white/40 transition-colors" />
                       <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                             <span className="text-neutral-500 uppercase tracking-widest">SYNC_0{i}:12:{i*2}</span>
                             <span className={cn("font-black uppercase tracking-[0.2em]", item.color)}>{item.status}</span>
                          </div>
                          <h4 className="text-sm font-black text-white uppercase italic">{item.node} :: {item.action}</h4>
                       </div>
                    </div>
                  ))}
               </div>
               
               {/* Terminal Footer */}
               <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-cyan-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Neural_Shell_Active</span>
                  </div>
                  <div className="p-4 bg-black rounded-2xl border border-white/5 font-mono text-[9px] text-neutral-600 uppercase tracking-widest leading-relaxed">
                    System_Ready... <br />
                    Awaiting_Input_Sequence... <br />
                    Global_Scan_Complete_100%
                  </div>
               </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-linear-to-br from-violet-600 to-fuchsia-700 rounded-4xl p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                  <Cpu className="w-20 h-20 text-white" />
               </div>
               <div className="relative z-10 space-y-2">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Collective_Compute</p>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter">1.2 PETAFLOPS</h3>
                  <div className="flex items-center gap-2 text-[9px] font-black text-white/80 uppercase tracking-widest pt-4">
                    <TrendingUp className="w-3 h-3" />
                    <span>8.2% Efficiency Gain Measured</span>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
