"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import AIVisual from "@/components/ai";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Zap, Shield, Cpu, ArrowLeft, Activity, Terminal, Lock, Eye, Send, Sparkles, MessageSquare, Bot } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const INTERCEPT_MESSAGES = [
  "DECRYPTING_NEURAL_DNA",
  "MAPPING_TOPOLOGICAL_VECTORS",
  "IDENTIFYING_SYNTHETIC_SIGNAL",
  "SYNCING_CORE_FRAGMENTS",
  "ANALYZING_COMMIT_ENTROPY",
  "RECONSTRUCTING_AUTHOR_IDENTITY",
  "INTERCEPTING_PACKET_0x9F4",
  "CALIBRATING_LOGIC_GATES"
];

const DEV_TRACK_ANSWERS: Record<string, string> = {
  "what is devtrack": "DevTrack is an advanced GitHub contribution tracker and impact analyzer. It uses Neural DNA mapping to visualize the real-world impact of your open-source contributions across the global repository network.",
  "what is code dna": "Code DNA is our proprietary architectural analysis engine. It scans commit patterns to determine authorship signatures, genetic coding styles (e.g., Stable_Typed vs Low_Level), and AI-to-human authorship ratios.",
  "how to scan": "You can initiate a scan from the Explore page or by asking me to analyze a specific GitHub node. I will then perform a high-dimensional topological analysis of the repository's health and contributor entropy.",
  "who are you": "I am DevTrack AI, a high-dimensional neural intelligence core designed to decode the global open-source ecosystem. I monitor thousands of nodes and authorship signatures in real-time.",
  "satellite": "The Satellite Interception Feed is a real-time tactical map of global system events, cache rebuilds, and node synchronizations happening across the OSS landscape.",
  "default": "Command recognized. I am currently scanning the DevTrack database for relevant signals. Initial results indicate high architectural integrity in the requested sector."
};

const ChatMessage = ({ msg, isAi }: { msg: string, isAi: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={cn(
      "flex gap-4 max-w-[85%] mb-6",
      isAi ? "mr-auto" : "ml-auto flex-row-reverse"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-full shrink-0 flex items-center justify-center border",
      isAi ? "bg-violet-600/20 border-violet-500/30 text-violet-400" : "bg-white/10 border-white/20 text-white"
    )}>
      {isAi ? <Bot size={14} /> : <div className="text-[10px] font-black">U</div>}
    </div>
    <div className={cn(
      "p-4 rounded-2xl text-[11px] leading-relaxed font-medium italic backdrop-blur-3xl",
      isAi 
        ? "bg-violet-600/5 border border-violet-500/20 text-violet-100 rounded-tl-none" 
        : "bg-white/5 border border-white/10 text-white rounded-tr-none"
    )}>
      {msg}
    </div>
  </motion.div>
);

const DiagnosticBar = ({ value, label, color }: { value: number, label: string, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[7px] font-black uppercase text-neutral-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={cn("h-full", color)} 
      />
    </div>
  </div>
);

export default function AIPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [pulseData, setPulseData] = useState<number[]>(Array(12).fill(20));
  const [messages, setMessages] = useState<{msg: string, isAi: boolean}[]>([
    { msg: "DevTrack AI core initialized. Ready for tactical inquiries. How can I assist your investigation?", isAi: true }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const msg = INTERCEPT_MESSAGES[Math.floor(Math.random() * INTERCEPT_MESSAGES.length)];
      setLogs(prev => [msg, ...prev.slice(0, 15)]);
    }, 2500);

    const pulseInterval = setInterval(() => {
      setPulseData(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
    }, 150);

    return () => {
      clearInterval(logInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isScanning) return;

    const userQuery = input.trim();
    setInput("");
    setMessages(prev => [...prev, { msg: userQuery, isAi: false }]);
    
    // Trigger Scanning Effect
    setIsScanning(true);
    
    // Simulate AI thinking and "Scanning Website"
    setTimeout(() => {
      const lowerQuery = userQuery.toLowerCase();
      let response = DEV_TRACK_ANSWERS["default"];
      
      for (const key in DEV_TRACK_ANSWERS) {
        if (lowerQuery.includes(key)) {
          response = DEV_TRACK_ANSWERS[key];
          break;
        }
      }

      setMessages(prev => [...prev, { msg: response, isAi: true }]);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-violet-500/30">
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,118,0.02))] bg-size-[100%_2px,3px_100%] opacity-20" />

      {/* HUD OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 top-32 pointer-events-none z-30">
        {/* TOP LEFT: BRAND & NAV */}
        <div className="absolute top-0 left-8 space-y-6 pointer-events-auto">
          <Link 
            href="/"
            className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Uplink_Return
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none group">
              DevTrack <span className="text-violet-500 italic block md:inline group-hover:text-fuchsia-500 transition-colors duration-700">AI</span>
            </h1>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest leading-none pt-0.5">Tactical_Intelligence_Active</span>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                <Cpu size={10} className="text-neutral-500" />
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest leading-none pt-0.5">Core_Auth_v4.2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP RIGHT: SYSTEM STATUS */}
        <div className="absolute top-0 right-8 space-y-6 pointer-events-auto flex flex-col items-end">
          <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-4xl p-8 space-y-6 min-w-[280px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest pt-0.5">Integrity_Grid</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-500">STABLE</div>
            </div>
            
            <div className="space-y-5">
              <DiagnosticBar label="Author DNA Correlation" value={98.4} color="bg-violet-500" />
              <DiagnosticBar label="Pattern Neutralization" value={14.2} color="bg-fuchsia-500" />
              <DiagnosticBar label="Architectural Integrity" value={89.7} color="bg-cyan-500" />
            </div>

            <div className="pt-4 flex justify-between items-center text-[8px] font-black text-neutral-600 uppercase tracking-widest">
              <span>SCAN_IDENT: 0x8F92</span>
              <span>VERIFIED_BY_DEUTRACK_AI</span>
            </div>
          </div>
        </div>

        {/* CENTERED BOTTOM INPUT: BIG COMMAND TERMINAL (NEW) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 pointer-events-auto">
           <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-4xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 pl-4">
                 <div className="flex items-center gap-3 shrink-0">
                    <Sparkles size={18} className="text-violet-500 animate-pulse" />
                    <div className="h-4 w-px bg-white/10" />
                 </div>
                 <input 
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Enter tactical query to scan DevTrack network..."
                   className="flex-1 bg-transparent border-none py-5 px-6 text-sm font-medium italic text-white placeholder-neutral-600 focus:outline-none focus:ring-0 transition-all selection:bg-violet-500/50"
                 />
                 <button 
                   type="submit"
                   disabled={!input.trim() || isScanning}
                   className="bg-violet-600 hover:bg-violet-500 disabled:opacity-20 text-white p-4 rounded-2xl transition-all shadow-xl shadow-violet-500/20 active:scale-95 flex items-center gap-2 group/btn"
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Analyze_Node</span>
                    <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                 </button>
              </div>
              <div className="flex justify-between items-center px-6 mt-3 text-[7px] font-black text-neutral-600 uppercase tracking-[0.3em]">
                 <span>System_Ready: 0x8F</span>
                 <span className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                    Neural_Link_Stable
                 </span>
              </div>
           </form>
        </div>

        {/* BOTTOM LEFT: INTERCEPT CONSOLE */}
        <div className="absolute bottom-8 left-8 w-80 space-y-4 pointer-events-auto hidden md:block lg:opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-2 px-1">
            <Terminal size={14} className="text-violet-500" />
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Intelligence_Feed</h3>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-48 flex flex-col">
            <div className="flex-1 overflow-hidden space-y-2 font-mono text-[8px] leading-relaxed">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - i * 0.15, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-3"
                  >
                    <span className="text-violet-500/60 shrink-0">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                    <span className="text-neutral-500 truncate">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: FREQUENCY & ACTION */}
        <div className="absolute bottom-8 right-8 space-y-6 text-right pointer-events-auto">
          <div className="flex items-end justify-end gap-1.5 h-12 px-4 border-r border-violet-500/30">
            {pulseData.map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: `${h}%` }}
                className="w-1 bg-linear-to-t from-violet-600 to-fuchsia-400 rounded-full opacity-60" 
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[8px] font-black text-neutral-700 uppercase tracking-[0.4em]">Integrated_Neural_Buffer</p>
            <div className="flex gap-8 justify-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-neutral-500 uppercase">Latency</span>
                <span className="text-2xl font-black text-white italic tabular-nums">14ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-neutral-500 uppercase">Entropy</span>
                <span className="text-2xl font-black text-violet-500 italic tabular-nums">0.024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE MAIN VISUAL */}
      <div className="absolute inset-x-0 bottom-0 top-32 z-10">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest animate-pulse">Establishing_Neural_Sync...</p>
             </div>
          </div>
        }>
          <AIVisual />
        </Suspense>
      </div>

      {/* SCANNING RIG (Overlay inside z-10/20) */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-violet-500 shadow-[0_0_50px_rgba(139,92,246,1)] flex items-center justify-center"
            >
               <div className="bg-violet-500 text-white px-4 py-1 text-[9px] font-black uppercase tracking-tighter -mt-8 shadow-xl flex items-center gap-2">
                  <Sparkles size={10} className="animate-pulse" />
                  Analyzing_Database_Signals
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRADIENT BLOOM */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
