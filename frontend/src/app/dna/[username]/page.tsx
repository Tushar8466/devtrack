"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dna, 
  Fingerprint, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Search,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface Trait {
  name: string;
  value: number;
  description: string;
}

interface DNAData {
  user: any;
  dna: {
    traits: Trait[];
    signature: {
      hash: string;
      type: string;
      compatibility: number;
    };
  };
}

export default function DNAPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<DNAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    
    const fetchDNA = async () => {
      try {
        const res = await fetch(`/api/dna?username=${username}`);
        if (!res.ok) throw new Error("SEQUENCE_ANALYSIS_FAILED");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDNA();
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 pb-24 overflow-x-hidden">
      <BackgroundBeams className="opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-40 space-y-8"
            >
               <div className="relative">
                 <Dna className="w-20 h-20 text-indigo-500 animate-pulse" />
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-4 border-2 border-dashed border-indigo-500/30 rounded-full"
                 />
               </div>
               <div className="text-center space-y-2">
                 <h2 className="text-2xl font-black uppercase tracking-[0.4em] animate-pulse">Deconstructing DNA</h2>
                 <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">Sequencing_Author_Fingerprint_Pattern_{username}...</p>
               </div>
            </motion.div>
          ) : error ? (
            <div className="py-40 text-center">
              <h2 className="text-4xl font-black text-rose-500 uppercase tracking-tighter">Trace Lost</h2>
              <p className="text-neutral-500 mt-4 uppercase tracking-widest">{error}</p>
            </div>
          ) : data && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* Header Analysis */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/5 pb-16">
                 <div className="flex items-center gap-8">
                    <div className="relative group">
                       <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <img 
                         src={data.user.avatar_url} 
                         className="w-32 h-32 rounded-4xl border-2 border-indigo-500/30 p-1.5 relative z-10 grayscale hover:grayscale-0 transition-all duration-700" 
                         alt="" 
                       />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 bg-indigo-500 text-black text-[9px] font-black uppercase tracking-widest rounded-sm italic">Verified_Author</span>
                          <span className="text-neutral-600 font-mono text-[10px] uppercase tracking-widest">ID: {data.dna.signature.hash}</span>
                       </div>
                       <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">{data.user.name || data.user.login}</h1>
                       <p className="text-indigo-400 font-black uppercase tracking-[0.3em] mt-2">@{data.user.login}</p>
                    </div>
                 </div>

                 <div className="bg-white/3 border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-12 backdrop-blur-3xl shrink-0 group hover:border-indigo-500/30 transition-colors">
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Compatibility</p>
                       <h3 className="text-5xl font-black text-white italic tabular-nums">{data.dna.signature.compatibility.toFixed(1)}%</h3>
                    </div>
                    <div className="w-px h-16 bg-white/10" />
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Genetic_Classification</p>
                       <h3 className="text-lg font-black text-indigo-400 uppercase tracking-tight italic">{data.dna.signature.type}</h3>
                    </div>
                 </div>
              </div>

              {/* Traits Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <Fingerprint className="w-6 h-6 text-indigo-500" />
                       <h2 className="text-2xl font-black uppercase tracking-tighter italic">Neural Trait Distribution</h2>
                    </div>

                    <div className="space-y-6">
                       {data.dna.traits.map((trait, i) => (
                         <div key={trait.name} className="space-y-3 group">
                            <div className="flex justify-between items-end">
                               <div>
                                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{trait.name}</h4>
                                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest group-hover:text-neutral-400 transition-colors">{trait.description}</p>
                               </div>
                               <span className="text-lg font-black text-indigo-500 italic tabular-nums">{trait.value.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${trait.value}%` }}
                                 transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                 className="h-full bg-linear-to-r from-indigo-600 to-violet-400"
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Code Visualizer Mock */}
                 <div className="bg-white/2 border border-white/5 rounded-4xl p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Code2 className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-8">
                       <div className="space-y-2">
                          <h3 className="text-xl font-black uppercase italic">Signature Sequence</h3>
                          <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">Raw_Binary_Heuristics</p>
                       </div>
                       
                       <div className="font-mono text-[9px] text-neutral-700 leading-relaxed uppercase tracking-tighter">
                          {[...Array(15)].map((_, i) => (
                             <div key={i} className="flex gap-4">
                                <span className="text-indigo-500/40">0x{Math.floor(Math.random() * 1000).toString(16)}</span>
                                <span className="text-white/20">{(Math.random() > 0.5 ? "11010110" : "00101101")}</span>
                                <span className="text-neutral-800">TRACE_NODE_{i}: ACTIVE</span>
                             </div>
                          ))}
                       </div>

                       <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Deep_Scanning...</span>
                          </div>
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                             View Analysis Logs <ChevronRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bottom Insight Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                 {[
                    { label: "Complexity Bias", value: "Algorithmic", icon: Cpu, color: "text-rose-500" },
                    { label: "Design Drift", value: "Optimized", icon: Zap, color: "text-amber-500" },
                    { label: "Security Hygiene", value: "Class-A", icon: ShieldCheck, color: "text-emerald-500" },
                 ].map((stat, i) => (
                    <div key={i} className="bg-white/3 border border-white/8 rounded-3xl p-8 hover:bg-white/5 transition-all group">
                       <stat.icon className={cn("w-6 h-6 mb-4 group-hover:scale-110 transition-transform", stat.color)} />
                       <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{stat.label}</p>
                       <h3 className="text-2xl font-black italic tracking-tighter mt-1">{stat.value}</h3>
                    </div>
                 ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
