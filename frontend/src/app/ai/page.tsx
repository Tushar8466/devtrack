"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import AIVisual from "@/components/ai";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Cpu, ArrowLeft, Terminal, Send, Sparkles, Bot, User, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  "what is code dna": "Code DNA is our proprietary architectural analysis engine. It scans commit patterns to determine authorship signatures (e.g., Stable_Typed vs Low_Level), code genetic styles, and AI-to-human authorship ratios.",
  "how to scan": "To initiate a scan, simply type 'analyze [username]' or paste a GitHub username/URL here. I'll perform a high-dimensional topological analysis of the target's contributor entropy and coding fingerprints.",
  "who are you": "I am the DevTrack Tactical Intelligence Core. My function is to monitor global open-source nodes, decode authorship signatures, and guide users through the DevTrack reconnaissance network.",
  "satellite": "The Satellite Interception Feed provides a real-time tactical map of global system events, cache rebuilds, and node synchronizations happening across the OSS landscape.",
  "dashboard": "Strategic sector: Your personalized dashboard displays connected identities, core metrics, and your historical impact trajectory within the network.",
  "explore": "The Explore module allows you to traverse the global repository network, using our Health Scouter to verify the pulse and structural integrity of any project.",
  "compare": "Variance tool: Use the Compare sector to place two identities side-by-side, analyzing the genetic variance in their coding signatures and architectural patterns.",
  "pulse": "DevTrack Pulse is the real-time stream of the global OSS heart rate. It monitors incoming commit shards and node activity across all tracked sectors.",
  "contribute": "You can expand our neural coverage by joining the contribution node. Check the 'Contribute' link in the navigation to see our open-source repositories and join the collective.",
  "os tracker": "The OS Tracker monitors the trajectory of major open-source projects, analyzing their architectural evolution and architectural health in real-time.",
  "how to use": "You can ask me technical questions about DevTrack features or provide a GitHub ID to initiate a deep-level DNA scan. Try asking 'What is Code DNA?' or typing 'analyze torvalds'.",
  "projects": "The Projects sector highlights key initiatives, collective builds, and high-impact repositories currently under high-resolution surveillance by the DevTrack core.",
  "default": "Data stream synchronized. I am currently monitoring all DevTrack sectors. Please provide a GitHub ID for deep DNA scanning or ask a tactical question about our operational modules (e.g., Pulse, Code DNA, Satellite)."
};

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
  const [input, setInput] = useState("");
  const [targetId, setTargetId] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isScanning) return;

    const lowerInput = trimmedInput.toLowerCase();
    
    // INTENT ANALYSIS
    const questionKeywords = ["what", "how", "who", "why", "tell", "explain", "info", "help", "guide"];
    const isQuestion = questionKeywords.some(k => lowerInput.includes(k));
    const isExplicitScan = lowerInput.startsWith("analyze") || lowerInput.startsWith("scan") || lowerInput.startsWith("search");
    const isRepoLink = lowerInput.includes("github.com/");
    
    // REDIRECTION PROTOCOL
    if ((isExplicitScan || isRepoLink || !isQuestion) && trimmedInput.length > 2) {
        let extractedId = trimmedInput;
        const words = trimmedInput.split(/\s+/);

        if (words.length > 1) {
          const fromIndex = words.findIndex((w: string) => w.toLowerCase() === 'from');
          const analyzeIndex = words.findIndex((w: string) => w.toLowerCase() === 'analyze');
          const atIndex = words.findIndex((w: string) => w.startsWith('@'));

          if (fromIndex !== -1 && words[fromIndex + 1]) extractedId = words[fromIndex + 1];
          else if (analyzeIndex !== -1 && words[analyzeIndex + 1]) extractedId = words[analyzeIndex + 1];
          else if (atIndex !== -1) extractedId = words[atIndex].substring(1);
          else extractedId = words[words.length - 1];
        }

        extractedId = extractedId.replace(/[?.!,]$/, "");
        if (extractedId.includes("github.com/")) {
          const parts = extractedId.split("/");
          extractedId = parts[parts.length - 1];
        }

        // Check if extractedId is a reserved keyword (not a user)
        const reserved = ["repo", "repository", "commits", "dna", "devtrack"];
        if (reserved.includes(extractedId.toLowerCase())) {
            // Fallback to question mode if it's a keyword
            handleQuestion(lowerInput);
            return;
        }

        setTargetId(extractedId);
        setIsScanning(true);
        setAiResponse(`INITIATING_TOPOLOGICAL_RECONNAISSANCE: ${extractedId}`);

        setTimeout(() => {
          window.location.href = `/analyze/${extractedId}`;
        }, 2200);
    } else {
        handleQuestion(lowerInput);
    }
  };

  const handleQuestion = (lowerInput: string) => {
    setIsTyping(true);
    setAiResponse(null);
    setInput("");

    setTimeout(() => {
        let response = DEV_TRACK_ANSWERS["default"];
        let bestMatch = "";
        for (const key in DEV_TRACK_ANSWERS) {
            if (lowerInput.includes(key) && key !== "default") {
                if (key.length > bestMatch.length) {
                    bestMatch = key;
                }
            }
        }
        if (bestMatch) response = DEV_TRACK_ANSWERS[bestMatch];
        setAiResponse(response);
        setIsTyping(false);
    }, 1000);
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

        {/* FLOATING AI RESPONSE BUBBLE */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 pointer-events-none">
            <AnimatePresence mode="wait">
                {(isTyping || aiResponse) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="bg-black/60 backdrop-blur-3xl border border-violet-500/20 p-6 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.1)] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-violet-600 to-transparent" />
                        <div className="flex gap-4 items-start">
                           <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/30">
                              <Bot size={18} className="text-violet-500" />
                           </div>
                           <div className="flex-1 pt-1">
                              {isTyping ? (
                                  <div className="flex gap-1 items-center h-4">
                                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-violet-500 rounded-full" />
                                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-violet-500 rounded-full" />
                                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-violet-500 rounded-full" />
                                  </div>
                              ) : (
                                  <p className="text-xs font-medium text-violet-100 leading-relaxed italic">
                                      {aiResponse}
                                  </p>
                              )}
                           </div>
                        </div>
                        {/* DECORATIVE BITS */}
                        <div className="absolute bottom-2 right-3 text-[6px] font-black text-violet-500/30 uppercase tracking-[0.2em] group-hover:text-violet-500/60 transition-colors">
                           Neural_Process: 0x8A9
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* CENTERED BOTTOM INPUT: BIG COMMAND TERMINAL */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 pointer-events-auto">
          <form onSubmit={handleSubmit} className="relative group/form">
            <div className="absolute -inset-2 bg-linear-to-r from-violet-600/20 to-fuchsia-600/20 rounded-[40px] blur-xl opacity-0 group-focus-within/form:opacity-100 transition duration-1000"></div>
            <div className="relative flex items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-3 pl-6 hover:border-violet-500/30 transition-all duration-500 shadow-2xl">
              <div className="flex items-center gap-4 shrink-0">
                <div className="relative">
                   <Sparkles size={22} className="text-violet-500 animate-pulse" />
                   <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-violet-500 rounded-full blur-md" />
                </div>
                <div className="h-6 w-px bg-white/10" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask intelligence about DevTrack or enter GitHub ID to scan..."
                className="flex-1 bg-transparent border-none py-6 px-6 text-base font-medium italic text-white placeholder-neutral-600 focus:outline-none focus:ring-0 transition-all selection:bg-violet-500/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isScanning}
                className="bg-linear-to-br from-violet-600 to-fuchsia-600 hover:scale-105 disabled:opacity-20 disabled:grayscale text-white px-8 py-5 rounded-[22px] transition-all shadow-xl shadow-violet-500/20 active:scale-95 flex items-center gap-3 group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Analyze_Core</span>
                <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
            
            {/* STATUS FOOTER */}
            <div className="flex justify-between items-center px-10 mt-5 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">
              <div className="flex items-center gap-4">
                 <span className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                    Neural_Link_Stable
                 </span>
                 <span className="opacity-40">|</span>
                 <span>Buffer: 0x00FF</span>
              </div>
              <div className="flex items-center gap-2 text-violet-500/50">
                 <Zap size={10} />
                 Tactical_Ready
              </div>
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
      <div className="absolute inset-x-0 bottom-0 top-72 z-10">
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
                Analyzing_Target_GitHub_Identity
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
