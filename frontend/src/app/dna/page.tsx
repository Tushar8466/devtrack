"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  Dna, 
  Search, 
  Fingerprint, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  SearchCode
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

export default function DNALandingPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dna/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 flex flex-col items-center justify-center p-6 overflow-hidden">
      <BackgroundBeams className="opacity-40" />
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="relative group">
            <div className="absolute -inset-8 bg-indigo-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="w-24 h-24 rounded-3xl bg-black border-2 border-indigo-500/30 flex items-center justify-center relative z-10 overflow-hidden">
                <Dna className="w-12 h-12 text-indigo-500 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-500/10 to-transparent" />
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
            >
               <Fingerprint className="w-3 h-3 text-indigo-400" />
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Authorship_Sequencing_Live</span>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
              Code <span className="bg-linear-to-r from-indigo-400 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">DNA</span>
            </h1>
            <p className="text-neutral-500 max-w-lg mx-auto font-mono text-xs uppercase tracking-[0.2em] leading-relaxed">
              Deconstruct authorship genetics. Search any GitHub profile to sequence their neural coding patterns.
            </p>
          </div>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleScan}
          className="relative max-w-3xl mx-auto group w-full"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-fuchsia-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative flex items-center bg-[#050505] border border-white/10 rounded-4xl p-3">
            <div className="flex-1 flex items-center px-6">
              <SearchCode className="w-6 h-6 text-neutral-600 shrink-0" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER_GITHUB_IDENTITY..."
                className="w-full bg-transparent border-none focus:ring-0 text-white font-black uppercase tracking-[0.2em] placeholder:text-neutral-800 text-lg md:text-xl ml-6 outline-hidden"
              />
            </div>
            <button 
              type="submit"
              className="bg-white text-black font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all text-[10px] md:text-xs flex items-center gap-3 shrink-0"
            >
              Sequence
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
        >
          {[
            { label: "Neural Drift", value: "Verified", icon: Zap, color: "text-amber-500" },
            { label: "Sync Status", value: "Active", icon: ShieldCheck, color: "text-emerald-500" },
            { label: "Trace Depth", value: "Level-9", icon: Sparkles, color: "text-indigo-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-default">
              <stat.icon className={cn("w-5 h-5 mb-3 mx-auto", stat.color)} />
              <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-white italic tracking-tighter mt-1">{stat.value}</h3>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative scanline */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
