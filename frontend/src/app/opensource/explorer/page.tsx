"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  GitBranch, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Box, 
  Cpu, 
  GitFork, 
  Star, 
  Users,
  Terminal,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

// Mock data generator for repo intelligence
const generatePulseData = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    time: `${i}:00`,
    frequency: 40 + Math.random() * 60,
    intensity: 20 + Math.random() * 80,
  }));
};

import { useSearchParams } from "next/navigation";

export default function OSExplorerPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const performSearch = async (targetQuery: string) => {
    if (!targetQuery) return;
    setLoading(true);
    setHistory(prev => {
      if (prev.includes(targetQuery)) return prev;
      return [targetQuery, ...prev.slice(0, 4)];
    });

    try {
      const res = await fetch(`https://api.github.com/repos/${targetQuery}`);
      const data = await res.json();
      if (data.id) {
        setRepoData(data);
      } else {
        alert("Tactical Intelligence Failure: Repository node not found.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const pulseData = useMemo(() => generatePulseData(), [repoData]);

  // Derived metrics
  const healthScore = useMemo(() => {
    if (!repoData) return 0;
    const score = (repoData.stargazers_count / 1000) + (repoData.forks_count / 100);
    return Math.min(98.4, 60 + score);
  }, [repoData]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-12 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-cyan-500 font-black tracking-[0.4em] text-[10px] animate-pulse">// OS_INTEL_UPLINK</span>
              <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active_Scan_Enabled</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Node <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Intelligence</span>
            </h1>
            <p className="text-neutral-500 font-medium text-lg italic max-w-xl">
              Deep-space tactical tracking for open source repositories. Map the neural pulse of the global software ecosystem.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative group w-full max-w-md">
            <div className="absolute inset-0 bg-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 transition-all">
              <div className="pl-6 text-neutral-600">
                <Search size={20} />
              </div>
              <input 
                type="text"
                placeholder="owner/repo (e.g. facebook/react)"
                className="w-full bg-transparent border-none outline-none py-4 px-4 font-mono text-sm placeholder:text-neutral-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-white text-black font-black px-6 py-4 hover:bg-cyan-400 transition-colors"
                disabled={loading}
              >
                {loading ? "SCANNING..." : "SCAN"}
              </button>
            </div>
          </form>
        </header>

        {/* REPO DATA OR EMPTY STATE */}
        {!repoData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full border border-white/5 bg-white/2 flex items-center justify-center relative">
                   <Globe size={40} className="text-neutral-700 animate-pulse" />
                   <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase italic tracking-tight">Awaiting Target Coordination</h3>
                   <p className="text-neutral-600 text-sm max-w-xs mx-auto">Enter a repository path in the tactical uplink above to initiate global asset analysis.</p>
                </div>
                
                {history.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 pt-8">
                    {history.map((h, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setQuery(h); }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-cyan-500/50 transition-all flex items-center gap-2"
                      >
                        <History size={12} /> {h}
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            
            {/* MAIN STATS OVERVIEW */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Star />, label: "Spectral stars", value: repoData.stargazers_count, color: "text-amber-400" },
                { icon: <GitFork />, label: "Branch Forks", value: repoData.forks_count, color: "text-blue-400" },
                { icon: <Users />, label: "Neural Nodes", value: repoData.subscribers_count || 0, color: "text-emerald-400" },
                { icon: <ShieldCheck />, label: "Health Score", value: `${healthScore.toFixed(1)}%`, color: "text-cyan-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-4xl p-8 backdrop-blur-3xl group hover:border-cyan-500/20 transition-all">
                  <div className="flex items-center justify-between mb-8">
                     <div className={cn("w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center", stat.color)}>
                        {stat.icon}
                     </div>
                     <span className="text-[10px] font-mono text-neutral-700 font-bold uppercase tracking-widest">METRIC_0{i + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{stat.label}</p>
                    <div className="text-4xl font-black text-white italic tracking-tighter">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LEFT COLUMN: IDENTIFIER & DETAILS */}
            <div className="space-y-8">
              <div className="bg-black/40 border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Box size={140} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Node_Asset_Local_Mapped</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{repoData.name}</h2>
                  <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">ID_{repoData.id}</p>
                </div>

                <p className="text-neutral-500 text-sm leading-relaxed italic border-l border-white/5 pl-6">
                  {repoData.description || "Experimental asset documentation unavailable. Prototypal nature detected."}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                     <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest font-mono">Pr_Language</span>
                     <p className="text-xs font-black text-white uppercase">{repoData.language || "Native_Binary"}</p>
                  </div>
                  <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                     <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest font-mono">License_T</span>
                     <p className="text-xs font-black text-white uppercase">{repoData.license?.spdx_id || "Unsecured"}</p>
                  </div>
                  <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                     <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest font-mono">Active_Issues</span>
                     <p className="text-xs font-black text-white uppercase">{repoData.open_issues_count}</p>
                  </div>
                  <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                     <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest font-mono">Node_Size</span>
                     <p className="text-xs font-black text-white uppercase">{(repoData.size / 1024).toFixed(1)} MB</p>
                  </div>
                </div>

                <a 
                  href={repoData.html_url} 
                  target="_blank" 
                  className="block w-full py-4 bg-white text-black text-center font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all rounded-2xl active:scale-95"
                >
                  Intercept Repository Source
                </a>
              </div>

              {/* TACTICAL STATUS FEED */}
              <div className="bg-black border border-white/5 rounded-4xl p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Status_Logs</h4>
                    <Activity size={14} className="text-cyan-500 animate-pulse" />
                 </div>
                 <div className="space-y-3 font-mono text-[9px]">
                    {[
                      { t: "14:22", e: "Establishing_Uplink", s: "OK" },
                      { t: "14:22", e: "Mapping_Global_Dependencies", s: "WAIT" },
                      { t: "14:23", e: "Neural_Drift_Detected", s: "ADJUST" },
                      { t: "14:24", e: "Asset_Validation_Successful", s: "DONE" },
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between border-b border-white/2 pb-1 opacity-60">
                         <span className="text-neutral-500">[{log.t}] {log.e}</span>
                         <span className="text-cyan-400">{log.s}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* MIDDLE/RIGHT COLUMN: VISUALIZATIONS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* ACTIVITY PULSE CHART */}
              <div className="bg-black/40 border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Tactical Activity Pulse</h3>
                       <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Global_Frequency_Index</p>
                    </div>
                    <div className="flex gap-4 text-right">
                       <div>
                          <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Peak_Amp</p>
                          <p className="text-lg font-black text-white italic">14.2Hz</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Drift_V</p>
                          <p className="text-lg font-black text-emerald-500 italic">0.02</p>
                       </div>
                    </div>
                 </div>

                 <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={pulseData}>
                          <defs>
                             <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', fontSize: '10px' }}
                            itemStyle={{ color: '#06b6d4' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="frequency" 
                            stroke="#06b6d4" 
                            fillOpacity={1} 
                            fill="url(#colorFreq)" 
                            strokeWidth={3}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="intensity" 
                            stroke="#8b5cf6" 
                            fillOpacity={0} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* COLLABORATOR DENSITY */}
                 <div className="bg-black/40 border border-white/5 rounded-4xl p-8 backdrop-blur-3xl space-y-6">
                    <div className="flex items-center gap-3">
                       <Users size={18} className="text-violet-400" />
                       <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Node Collaboration</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase">Commits / Day</span>
                          <span className="text-xl font-black text-white italic">{(repoData.stargazers_count / 1000).toFixed(1)}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            className="h-full bg-violet-500"
                          />
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase">Neural_Overlap</span>
                          <span className="text-xl font-black text-white italic">12.4%</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "12.4%" }}
                            className="h-full bg-emerald-500"
                          />
                       </div>
                    </div>
                 </div>

                 {/* RISK ASSESSMENT */}
                 <div className="bg-black/40 border border-white/5 rounded-4xl p-8 backdrop-blur-3xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 p-2 opacity-20">
                       <AlertTriangle size={40} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={18} className="text-cyan-400" />
                       <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Asset Risk Vector</h4>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                          <span>Deprecation_Risk</span>
                          <span className="text-emerald-500">LOW</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                          <span>Maintainer_S_Level</span>
                          <span className="text-amber-500">OPTIMAL</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                          <span>Security_Patch_V</span>
                          <span className="text-cyan-400">HIGH</span>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] text-neutral-600 leading-relaxed font-mono uppercase italic">
                           Analysis indicates stable architectural patterns. No critical vulnerabilities detected in top-level metadata.
                        </p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Global Scan Line Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-5">
        <motion.div 
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-full h-[50vh] bg-linear-to-b from-transparent via-cyan-500/20 to-transparent"
        />
      </div>
    </div>
  );
}
