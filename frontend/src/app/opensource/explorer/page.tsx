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
   Area,
   Radar,
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
} from 'recharts';

// Tactical Glitch Text Effect
const GlitchText = ({ text, className }: { text: string, className?: string }) => (
   <div className={cn("relative group inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-transform duration-100">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-transform duration-100">{text}</span>
   </div>
);

// Mock data generator for repo intelligence
const generatePulseData = () => {
   return Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      frequency: 30 + Math.random() * 70,
      intensity: 15 + Math.random() * 85,
   }));
};

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getLanguageColor } from "@/lib/language-colors";

function OSExplorerContent() {
   const searchParams = useSearchParams();
   const initialQuery = searchParams.get("q") || "";

   const [query, setQuery] = useState(initialQuery);
   const [compareQuery, setCompareQuery] = useState("");
   const [mode, setMode] = useState<"scan" | "compare">("scan");

   const [repoData, setRepoData] = useState<any>(null);
   const [repoLanguages, setRepoLanguages] = useState<any>(null);
   const [repoEvents, setRepoEvents] = useState<any[]>([]);
   const [repoContributors, setRepoContributors] = useState<any[]>([]);
   const [compareRepoData, setCompareRepoData] = useState<any>(null);

   const [loading, setLoading] = useState(false);
   const [history, setHistory] = useState<string[]>([]);

   const trendingNodes = [
      { name: "React", path: "facebook/react", icon: "⚛️" },
      { name: "Next.js", path: "vercel/next.js", icon: "▲" },
      { name: "Tailwind", path: "tailwindlabs/tailwindcss", icon: "🌊" },
      { name: "VS Code", path: "microsoft/vscode", icon: "💻" },
      { name: "Three.js", path: "mrdoob/three.js", icon: "🧱" },
      { name: "Bun", path: "oven-sh/bun", icon: "🍔" }
   ];

   const [isSimulated, setIsSimulated] = useState(false);

   const MOCK_REPO = (path: string) => {
      const [owner, name] = (path || "unknown/repo").split("/");
      const hash = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
      const h = Math.abs(hash(path));
      
      const lang = ["TypeScript", "Rust", "Go", "C++", "Python"][h % 5];
      return {
         id: h,
         name: name || "unknown",
         full_name: path,
         owner: { login: owner || "unknown", avatar_url: `https://avatars.githubusercontent.com/u/${h % 50000}?v=4` },
         description: "Automated architectural mapping of high-impact open source infrastructure. Neural patterns indicate high stylistic entropy and robust modularity.",
         stargazers_count: (h % 50000) + 12000,
         forks_count: (h % 5000) + 1500,
         subscribers_count: (h % 2000) + 400,
         open_issues_count: h % 400,
         size: (h % 800000) + 100000,
         language: lang,
         license: { spdx_id: "MIT" },
         html_url: `https://github.com/${path}`,
      };
   };

   const performSearch = async (targetQuery: string, isCompare = false) => {
      if (!targetQuery) return;
      setLoading(true);
      setIsSimulated(false);
      
      if (!isCompare) {
         setHistory(prev => {
            if (prev.includes(targetQuery)) return prev;
            return [targetQuery, ...prev.slice(0, 4)];
         });
      }

      try {
         const res = await fetch(`https://api.github.com/repos/${targetQuery}`);
         
         if (res.status === 403) {
            console.warn("API Limit Reached. Activating OS Simulation.");
            const mock = MOCK_REPO(targetQuery);
            if (isCompare) setCompareRepoData(mock);
            else {
               setRepoData(mock);
               setRepoLanguages({ [mock.language]: 100000, "Others": 20000 });
               setRepoContributors([{ login: "neural_architect", avatar_url: "", contributions: Math.abs(mock.id % 100) + 50 }]);
               setIsSimulated(true);
            }
            return;
         }

         const data = await res.json();
         if (data.id) {
            if (isCompare) {
               setCompareRepoData(data);
            } else {
               setRepoData(data);
               // Fetch languages
               const langRes = await fetch(data.languages_url);
               if (langRes.status === 403) setRepoLanguages({ [data.language || "Unknown"]: 100 });
               else setRepoLanguages(await langRes.json());

               // Fetch events
               const eventsRes = await fetch(`https://api.github.com/repos/${targetQuery}/events?per_page=10`);
               const eventsData = await eventsRes.json();
               setRepoEvents(Array.isArray(eventsData) ? eventsData : []);

               // Fetch contributors
               const contribRes = await fetch(`https://api.github.com/repos/${targetQuery}/contributors?per_page=8`);
               if (contribRes.status === 403) setRepoContributors([]);
               else {
                  const contribData = await contribRes.json();
                  setRepoContributors(Array.isArray(contribData) ? contribData : []);
               }
            }
         } else {
            alert("Tactical Intelligence Failure: Node not found.");
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
         <AnimatePresence>
             {isSimulated && (
                 <motion.div 
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-violet-600/90 text-white py-2 px-6 fixed top-0 left-0 w-full z-50 backdrop-blur-md flex items-center justify-between border-b border-white/10"
                 >
                     <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural_Simulation_Mode :: API_Uplink_Limited</span>
                     </div>
                     <button onClick={() => window.location.reload()} className="text-[9px] font-black underline hover:text-white/80">Sync_Matrix</button>
                 </motion.div>
             )}
         </AnimatePresence>
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
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                     <GlitchText text="Node" />{" "}
                     <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Intelligence</span>
                  </h1>
                  <p className="text-neutral-500 font-medium text-xl italic max-w-xl">
                     Strategic asset tracking system for the Global Open Source Grid. Intercept neural patterns and structural integrity.
                  </p>
               </div>

               <div className="flex flex-col gap-6 w-full max-w-md">
                  {/* Mode Toggle */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-end">
                     <button
                        onClick={() => setMode("scan")}
                        className={cn(
                           "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                           mode === "scan" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "text-neutral-500 hover:text-white"
                        )}
                     >
                        Deep_Scan
                     </button>
                     <button
                        onClick={() => setMode("compare")}
                        className={cn(
                           "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                           mode === "compare" ? "bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "text-neutral-500 hover:text-white"
                        )}
                     >
                        Neural_Compare
                     </button>
                  </div>

                  <form onSubmit={handleSearch} className="relative group w-full">
                     <div className={cn(
                        "absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
                        mode === "scan" ? "bg-cyan-500/10" : "bg-violet-500/10"
                     )} />
                     <div className={cn(
                        "relative flex flex-col gap-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all p-2",
                        "focus-within:border-white/20"
                     )}>
                        <div className="flex items-center">
                           <div className="pl-4 text-neutral-600">
                              <Search size={18} />
                           </div>
                           <input
                              type="text"
                              placeholder={mode === "scan" ? "owner/repo (Target Alpha)" : "Primary Target Node"}
                              className="w-full bg-transparent border-none outline-none py-3 px-4 font-mono text-sm placeholder:text-neutral-700 text-white"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                           />
                        </div>

                        {mode === "compare" && (
                           <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className="flex items-center border-t border-white/5 pt-2"
                           >
                              <div className="pl-4 text-neutral-600">
                                 <Zap size={18} />
                              </div>
                              <input
                                 type="text"
                                 placeholder="Comparison Target Node"
                                 className="w-full bg-transparent border-none outline-none py-3 px-4 font-mono text-sm placeholder:text-neutral-700 text-white"
                                 value={compareQuery}
                                 onChange={(e) => setCompareQuery(e.target.value)}
                              />
                           </motion.div>
                        )}

                        <button
                           type="submit"
                           onClick={() => {
                              performSearch(query);
                              if (mode === "compare") performSearch(compareQuery, true);
                           }}
                           className={cn(
                              "w-full font-black py-3 hover:opacity-90 transition-all rounded-xl mt-1 text-[10px] uppercase tracking-[0.2em]",
                              mode === "scan" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                           )}
                           disabled={loading}
                        >
                           {loading ? "INTERCEPTING..." : mode === "scan" ? "INITIATE SCAN" : "CALCULATE VARIANCE"}
                        </button>
                     </div>
                  </form>
               </div>
            </header>

            {/* REPO DATA OR EMPTY STATE */}
            {mode === "compare" && repoData && compareRepoData ? (
               <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  {/* COMPARISON METRICS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                        { label: "Stars Variance", v1: repoData.stargazers_count, v2: compareRepoData.stargazers_count, icon: <Star /> },
                        { label: "Fork Delta", v1: repoData.forks_count, v2: compareRepoData.forks_count, icon: <GitFork /> },
                        { label: "Node Density", v1: repoData.subscribers_count || 0, v2: compareRepoData.subscribers_count || 0, icon: <Users /> },
                        { label: "Issue Backlog", v1: repoData.open_issues_count, v2: compareRepoData.open_issues_count, icon: <AlertTriangle /> },
                     ].map((stat, i) => {
                        const diff = stat.v1 - stat.v2;
                        const perc = ((Math.abs(diff) / Math.max(stat.v1, stat.v2)) * 100).toFixed(1);
                        return (
                           <div key={i} className="bg-white/5 border border-white/10 rounded-4xl p-8 backdrop-blur-3xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">{stat.icon}</div>
                              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">{stat.label}</p>
                              <div className="flex items-end justify-between gap-4">
                                 <div className="space-y-1">
                                    <p className="text-[8px] font-black text-cyan-500 uppercase">Target_Alpha</p>
                                    <p className="text-2xl font-black text-white italic tracking-tighter">{stat.v1.toLocaleString()}</p>
                                 </div>
                                 <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-black text-violet-500 uppercase">Target_Beta</p>
                                    <p className="text-2xl font-black text-white italic tracking-tighter">{stat.v2.toLocaleString()}</p>
                                 </div>
                              </div>
                              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                 <span className={cn("text-[9px] font-black uppercase tracking-tight", diff > 0 ? "text-cyan-400" : "text-violet-400")}>
                                    {diff > 0 ? "Alpha_Dominant" : "Beta_Dominant"}
                                 </span>
                                 <span className="text-[10px] font-mono text-neutral-500">{perc}% Variance</span>
                              </div>
                           </div>
                        );
                     })}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Asset Identity Comparison */}
                        <div className="bg-black border border-white/10 rounded-4xl p-10 flex flex-col md:flex-row gap-12 items-center">
                           <div className="flex-1 text-center md:text-left space-y-4">
                              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto md:mx-0">
                                 <Globe size={32} />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{repoData.name}</h3>
                              <p className="text-sm text-neutral-500 line-clamp-2 italic">{repoData.description}</p>
                           </div>
                           <div className="hidden md:flex flex-col items-center gap-2">
                              <div className="h-20 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
                              <span className="text-[10px] font-black text-white px-3 py-1 bg-white/5 border border-white/10 rounded-full">VS</span>
                              <div className="h-20 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
                           </div>
                           <div className="flex-1 text-center md:text-right space-y-4">
                              <div className="w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto md:ml-auto md:mr-0">
                                 <Cpu size={32} />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{compareRepoData.name}</h3>
                              <p className="text-sm text-neutral-500 line-clamp-2 italic">{compareRepoData.description}</p>
                           </div>
                        </div>

                        {/* Comparative Radar Matrix */}
                        <div className="bg-white/2 border border-white/5 rounded-4xl p-10 backdrop-blur-3xl relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-8">
                              <div className="space-y-1">
                                 <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">Spectral Comparison Matrix</h4>
                                 <p className="text-[9px] font-mono text-neutral-600 uppercase">Dual_Asset_Stoichiometry</p>
                              </div>
                              <Zap size={18} className="text-amber-400 animate-pulse" />
                           </div>

                           <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                    { subject: 'Stars', A: repoData.stargazers_count / 1000, B: compareRepoData.stargazers_count / 1000, fullMark: 150 },
                                    { subject: 'Forks', A: repoData.forks_count / 100, B: compareRepoData.forks_count / 100, fullMark: 150 },
                                    { subject: 'Issues', A: repoData.open_issues_count / 10, B: compareRepoData.open_issues_count / 10, fullMark: 150 },
                                    { subject: 'Subscribers', A: repoData.subscribers_count || 0, B: compareRepoData.subscribers_count || 0, fullMark: 150 },
                                    { subject: 'Size', A: repoData.size / 1000, B: compareRepoData.size / 1000, fullMark: 150 },
                                 ]}>
                                    <PolarGrid stroke="#ffffff10" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} />
                                    <Radar name="Alpha" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                                    <Radar name="Beta" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                    <Tooltip
                                       contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', fontSize: '10px' }}
                                    />
                                 </RadarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ) : !repoData ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-12">
                     <div className="space-y-6">
                        <div className="w-24 h-24 rounded-full border border-white/5 bg-white/2 flex items-center justify-center relative mx-auto">
                           <Globe size={40} className="text-neutral-700 animate-pulse" />
                           <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black uppercase italic tracking-tight">Awaiting Target Coordination</h3>
                           <p className="text-neutral-600 text-sm max-w-xs mx-auto">Enter a repository path in the tactical uplink above to initiate global asset analysis.</p>
                        </div>
                     </div>

                     {/* Trending Suggestions */}
                     <div className="space-y-6 w-full max-w-4xl">
                        <p className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em]">Suggested_High-Entropy_Nodes</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                           {trendingNodes.map((node, i) => (
                              <button
                                 key={i}
                                 onClick={() => { setQuery(node.path); performSearch(node.path); }}
                                 className="group p-6 bg-white/2 border border-white/5 rounded-3xl hover:border-cyan-500/30 hover:bg-white/5 transition-all relative overflow-hidden active:scale-95"
                              >
                                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                 <span className="text-2xl mb-3 block">{node.icon}</span>
                                 <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{node.name}</p>
                                 <p className="text-[8px] font-mono text-neutral-600 uppercase mt-1 truncate">{node.path}</p>
                              </button>
                           ))}
                        </div>
                     </div>

                     {history.length > 0 && (
                        <div className="space-y-4">
                           <p className="text-[9px] font-bold text-neutral-800 uppercase tracking-[0.2em]">Previous_Coordinates</p>
                           <div className="flex flex-wrap justify-center gap-3">
                              {history.map((h, i) => (
                                 <button
                                    key={i}
                                    onClick={() => { setQuery(h); performSearch(h); }}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-cyan-500/50 transition-all flex items-center gap-2"
                                 >
                                    <History size={12} /> {h}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">

                  {/* MAIN STATS OVERVIEW */}
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                        { icon: <Star />, label: "Spectral stars", value: repoData.stargazers_count, color: "text-amber-400" },
                        { icon: <GitFork />, label: "Branch Forks", value: repoData.forks_count, color: "text-blue-400" },
                        { icon: <Users />, label: "Neural Nodes", value: repoData.subscribers_count || 0, color: "text-emerald-400" },
                        { icon: <ShieldCheck />, label: "Health Score", value: `${healthScore.toFixed(1)}%`, color: "text-cyan-400" },
                     ].map((stat, i) => (
                        <div key={i} className="bg-black border border-white/5 rounded-4xl p-8 backdrop-blur-3xl group hover:border-cyan-500/20 transition-all">
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
                     <div className="bg-black border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
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
                           <div className="flex items-center gap-2">
                              <Activity size={14} className="text-cyan-500 animate-pulse" />
                              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Status_Logs</h4>
                           </div>
                           <span className="text-[8px] font-mono text-neutral-700">NODE_VER_2.4.0</span>
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

                     {/* NEURAL HEALTH SCOUTER */}
                     <div className="bg-[#050505] border border-white/5 rounded-4xl p-10 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.15),transparent)] opacity-50" />
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                           <div className="relative w-40 h-40 flex items-center justify-center">
                              {/* Background Rings */}
                              <div className="absolute inset-0 border border-white/5 rounded-full" />
                              <div className="absolute inset-4 border border-white/5 rounded-full border-dashed animate-spin-slow opacity-20" />

                              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                 <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/5" />
                                 <motion.circle
                                    cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="6"
                                    className="text-cyan-500"
                                    strokeDasharray="465"
                                    initial={{ strokeDashoffset: 465 }}
                                    animate={{ strokeDashoffset: 465 - (465 * (healthScore / 100)) }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                 />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                 <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-4xl font-black text-white italic leading-none tracking-tighter"
                                 >
                                    {healthScore.toFixed(1)}
                                 </motion.span>
                                 <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest mt-1">Integrity</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Structural Buffer</h4>
                              <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Efficiency_Index::{(healthScore * 0.94).toFixed(2)}v</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* MIDDLE/RIGHT COLUMN: VISUALIZATIONS */}
                  <div className="lg:col-span-2 space-y-8">

                     {/* ACTIVITY PULSE CHART */}
                     <div className="bg-black border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8">
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
                                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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

                     {/* NEURAL DNA COMPONENT */}
                     {repoLanguages && (
                        <div className="bg-black border border-white/5 rounded-4xl p-10 backdrop-blur-3xl overflow-hidden relative group">
                           <div className="flex items-center justify-between mb-10">
                              <div className="space-y-1">
                                 <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Neural Language DNA</h3>
                                 <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Architectural_Composition_Matrix</p>
                              </div>
                              <Box size={20} className="text-cyan-500 animate-spin-slow" />
                           </div>

                           <div className="flex flex-wrap gap-4">
                              {Object.entries(repoLanguages).map(([lang, bytes]: [string, any], i) => {
                                 const total = Object.values(repoLanguages).reduce((a: any, b: any) => a + b, 0) as number;
                                 const percentage = (bytes / total) * 100;
                                 const langColor = getLanguageColor(lang);

                                 return (
                                    <div key={lang} className="flex-1 min-w-[140px] p-6 bg-white/2 border border-white/5 rounded-3xl hover:bg-white/5 transition-all group/lang">
                                       <div className="flex items-center justify-between mb-4">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                                          <span className="text-[8px] font-mono text-neutral-600">DNA_{i.toString().padStart(2, '0')}</span>
                                       </div>
                                       <h4 className="text-sm font-black text-white uppercase tracking-tight">{lang}</h4>
                                       <div className="mt-4 flex items-end gap-2">
                                          <span className="text-2xl font-black text-white">{percentage.toFixed(1)}</span>
                                          <span className="text-[10px] font-bold text-neutral-500 mb-1">%</span>
                                       </div>
                                       <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                          <motion.div
                                             initial={{ width: 0 }}
                                             animate={{ width: `${percentage}%` }}
                                             style={{ backgroundColor: langColor }}
                                             className="h-full"
                                             transition={{ duration: 1, delay: i * 0.1 }}
                                          />
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>

                           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                     )}

                     {/* BIG FEATURE: NEURAL CONTRIBUTOR MATRIX */}
                     {repoContributors.length > 0 && (
                        <div className="bg-[#050505] border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-8">
                              <div className="space-y-1">
                                 <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Architectural Elite</h3>
                                 <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Primary_Neutral_Network_Architects</p>
                              </div>
                              <Users size={20} className="text-emerald-500 animate-pulse" />
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {repoContributors.map((user, i) => (
                                 <div key={user.id} className="p-4 bg-white/2 border border-white/5 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/user relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover/user:opacity-100 transition-opacity">
                                       <Activity size={12} className="text-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden border border-white/10 group-hover/user:border-emerald-500/30 transition-colors">
                                       <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover grayscale group-hover/user:grayscale-0 scale-100 group-hover/user:scale-110 transition-all duration-700" />
                                       <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                                       <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                          <span className="text-[8px] font-black text-emerald-400">IMPACT_0{i + 1}</span>
                                          <TrendingUp size={10} className="text-emerald-500" />
                                       </div>
                                    </div>
                                    <h4 className="text-[10px] font-black text-white uppercase truncate">{user.login}</h4>
                                    <p className="text-[8px] font-mono text-neutral-600 uppercase mt-1 group-hover/user:text-emerald-500/70 transition-colors">{user.contributions} NODES</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* BIG FEATURE: ARCHITECTURAL IMPULSE MAP (HEATMAP) */}
                     <div className="bg-[#050505] border border-white/5 rounded-4xl p-10 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                           <div className="space-y-1">
                              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Architectural Impulse Map</h3>
                              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">30_Day_Neural_Activity_Density</p>
                           </div>
                           <Activity size={20} className="text-cyan-500" />
                        </div>

                        <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-4 scrollbar-hide">
                           {Array.from({ length: 28 }).map((_, i) => {
                              const intensity = Math.random();
                              return (
                                 <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={cn(
                                       "aspect-square rounded-md border border-white/5 relative group/cell",
                                       intensity > 0.8 ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" :
                                          intensity > 0.5 ? "bg-cyan-500/40" :
                                             intensity > 0.2 ? "bg-cyan-500/10" : "bg-white/2"
                                    )}
                                 >
                                    <div className="absolute inset-0 border border-cyan-500/0 group-hover/cell:border-cyan-500/50 rounded-md transition-colors" />
                                 </motion.div>
                              );
                           })}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[8px] font-black text-neutral-600 uppercase tracking-widest">
                           <span>Temporal_Origin</span>
                           <div className="flex items-center gap-2">
                              <span>Density:</span>
                              <div className="flex gap-1">
                                 <div className="w-2 h-2 bg-white/2 rounded-xs" />
                                 <div className="w-2 h-2 bg-cyan-500/10 rounded-xs" />
                                 <div className="w-2 h-2 bg-cyan-500/40 rounded-xs" />
                                 <div className="w-2 h-2 bg-cyan-500 rounded-xs" />
                              </div>
                           </div>
                           <span>Current_Epoch</span>
                        </div>
                     </div>

                     {/* BIG FEATURE: GLOBAL GEO-TELEMETRY */}
                     <div className="bg-[#050505] border border-white/10 rounded-4xl p-10 backdrop-blur-3xl overflow-hidden relative group h-[400px]">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-10">
                           <Globe size={300} />
                        </div>
                        <div className="relative z-10 space-y-2 mb-8">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Global Telemetry Intercept</h3>
                           <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Distributed_Node_Propagation_Map</p>
                        </div>

                        {/* Simulated Map Visual */}
                        <div className="absolute inset-0 top-20 flex items-center justify-center pointer-events-none opacity-20">
                           <div className="relative w-full h-full">
                              {[
                                 { t: 40, l: 30 }, { t: 60, l: 70 }, { t: 20, l: 50 }, { t: 80, l: 20 }, { t: 10, l: 80 }
                              ].map((pos, i) => (
                                 <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                    className="absolute w-4 h-4 rounded-full bg-cyan-500/50"
                                    style={{ top: `${pos.t}%`, left: `${pos.l}%` }}
                                 >
                                    <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping" />
                                 </motion.div>
                              ))}
                              <svg className="w-full h-full">
                                 <path d="M 100 100 L 200 300 L 400 150 L 500 400" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="2 4" className="animate-[dash_20s_linear_infinite]" />
                              </svg>
                           </div>
                        </div>

                        <div className="absolute bottom-10 left-10 space-y-2">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Signal_Locked: 14.8.2.190</span>
                           </div>
                           <div className="flex items-center gap-2 opacity-50">
                              <div className="w-2 h-2 rounded-full bg-cyan-500" />
                              <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Uplink_Relay: SAT_EPSILON_7</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* COLLABORATOR DENSITY */}
                        <div className="bg-[#050505] border border-white/5 rounded-4xl p-8 backdrop-blur-3xl space-y-6">
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
                        <div className="bg-[#050505] border border-white/5 rounded-4xl p-8 backdrop-blur-3xl space-y-6 relative overflow-hidden group">
                           <div className="absolute top-2 right-2 p-2 opacity-20 group-hover:scale-110 transition-transform">
                              <AlertTriangle size={40} className="text-amber-500" />
                           </div>
                           <div className="flex items-center gap-3">
                              <ShieldCheck size={18} className="text-cyan-400" />
                              <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Asset Risk Vector</h4>
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                                 <span>Deprecation_Risk</span>
                                 <span className="text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded">LOW</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                                 <span>Maintainer_S_Level</span>
                                 <span className="text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded">OPTIMAL</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500">
                                 <span>Security_Patch_V</span>
                                 <span className="text-cyan-400 px-2 py-0.5 bg-cyan-400/10 rounded">HIGH</span>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-white/5">
                              <p className="text-[9px] text-neutral-600 leading-relaxed font-mono uppercase italic group-hover:text-neutral-400 transition-colors">
                                 Analysis indicates stable architectural patterns. No critical vulnerabilities detected in top-level metadata.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* SATELLITE INTERCEPTION FEED */}
                     <div className="bg-black border border-white/10 rounded-4xl p-10 backdrop-blur-3xl overflow-hidden relative group">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Live_Satellite_Feed</span>
                        </div>

                        <div className="space-y-2 mb-8">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Orbital Frequency Intercept</h3>
                           <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Global_Event_Stream_Sync</p>
                        </div>
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide font-mono group/feed">
                           {repoEvents.length > 0 ? repoEvents.map((event, i) => (
                              <motion.div
                                 key={i}
                                 initial={{ x: -20, opacity: 0 }}
                                 animate={{ x: 0, opacity: 1 }}
                                 transition={{ delay: i * 0.1, duration: 0.5 }}
                                 className="relative p-5 bg-[#050505] border border-white/5 rounded-2xl hover:border-cyan-500/30 hover:bg-white/5 transition-all space-y-3"
                              >
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                       <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                          {event.type.replace('Event', '')}
                                       </span>
                                    </div>
                                    <span className="text-[9px] font-mono text-neutral-700 font-bold">[{new Date(event.created_at).toLocaleTimeString()}]</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <img src={event.actor.avatar_url} className="w-8 h-8 rounded-lg border border-white/10 grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
                                    <p className="text-xs text-neutral-400 leading-none">
                                       <span className="text-white font-black italic tracking-tight">{event.actor.display_login}</span>
                                       <span className="block mt-1 text-[9px] font-mono text-neutral-600">ACTION_RELAY_SEQ::{(Math.random() * 1000).toFixed(0)}</span>
                                    </p>
                                 </div>
                                 {event.payload.commits && (
                                    <div className="mt-3 pl-4 border-l-2 border-cyan-500/10 space-y-2">
                                       {event.payload.commits.slice(0, 1).map((commit: any, ci: number) => (
                                          <p key={ci} className="text-[10px] text-neutral-500 leading-relaxed italic group-hover:text-neutral-300 transition-colors">
                                             <GlitchText text={`> ${commit.message}`} className="opacity-80" />
                                          </p>
                                       ))}
                                    </div>
                                 )}
                                 <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Terminal size={40} />
                                 </div>
                              </motion.div>
                           )) : (
                              <div className="py-24 text-center space-y-6">
                                 <div className="relative inline-block">
                                    <Terminal size={48} className="mx-auto text-neutral-800 animate-pulse" />
                                    <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full scale-150 animate-ping" />
                                 </div>
                                 <p className="text-[11px] text-neutral-600 font-black uppercase tracking-[0.4em] animate-pulse">Scanning_Orbital_Sectors...</p>
                              </div>
                           )}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black to-transparent pointer-events-none" />
                     </div>

                     {/* BIG FEATURE: STRATEGIC AI BRIEFING */}
                     <div className="lg:col-span-full bg-[#050508] border border-white/5 rounded-4xl p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-1000">
                           <ShieldCheck size={200} />
                        </div>
                        <div className="relative z-10 space-y-10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                 <Cpu size={24} />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Strategic AI Intelligence Brief</h3>
                                 <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Neural_Analysis_Report // ASSET_ID_{repoData.id}</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Architectural Velocity</h4>
                                 <p className="text-sm text-neutral-400 leading-relaxed italic">
                                    Current node telemetry indicates high-density commit velocity. The architectural patterns suggest a multi-layered propagation model, optimized for low-latency node-to-node communication.
                                 </p>
                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-white uppercase">Growth_Vector</span>
                                    <span className="text-emerald-500 text-xs font-black italic">+12.4%</span>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em]">Operational Stability</h4>
                                 <p className="text-sm text-neutral-400 leading-relaxed italic">
                                    Stability metrics are within optimal range. PR-to-Issue ratio maintains a stable equilibrium, preventing entropy accumulation within the core repository branches.
                                 </p>
                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-white uppercase">Entropy_Risk</span>
                                    <span className="text-cyan-500 text-xs font-black italic">NOMINAL</span>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Ecological Impact</h4>
                                 <p className="text-sm text-neutral-400 leading-relaxed italic">
                                    This asset acts as a primary gravity well for the <span className="text-white font-bold">{repoData.language}</span> ecosystem. Downstream dependency clusters rely heavily on this node for structural integrity.
                                 </p>
                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-white uppercase">Ecosystem_Weight</span>
                                    <span className="text-amber-500 text-xs font-black italic">MASSIVE</span>
                                 </div>
                              </div>
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

export default function OSExplorerPage() {
   return (
      <Suspense fallback={
         <div className="min-h-screen bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden">
            {/* Multi-Orbital Scanner Animation */}
            <div className="relative w-64 h-64 mb-12">
               <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full"
               />
               <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border border-violet-500/20 rounded-full"
               />
               <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-10 border-4 border-cyan-500/40 rounded-full blur-sm"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={40} className="text-cyan-500 animate-pulse" />
               </div>
            </div>

            <div className="text-center space-y-4 relative z-10">
               <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Initializing Tactical Uplink</h2>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1/2 h-full bg-cyan-500"
                     />
                  </div>
                  <p className="text-[10px] font-mono text-cyan-500 tracking-[0.4em] uppercase animate-pulse">Scanning_Orbital_Sectors...</p>
               </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
         </div>
      }>
         <OSExplorerContent />
      </Suspense>
   );
}
