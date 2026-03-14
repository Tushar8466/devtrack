"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  X,
  Send,
  Zap,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Command,
  Search,
  User,
  Shield,
  HelpCircle,
  Activity,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BotAgent = dynamic(() => import("./bot"), { ssr: false });

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  actions?: { label: string; route: string }[];
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  type: "bot",
  text: "Initializing A.T.L.A.S. (Autonomous Tactical Language & Analysis System). I am your neural guide. How shall we proceed with the mission?",
  actions: [
    { label: "Scan a Profile", route: "/explore" },
    { label: "Open Source Tracker", route: "/opensource" },
    { label: "Compare Developers", route: "/compare" }
  ]
};

export function AtlasAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  // Mouse tracking for interactive spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), type: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI Logic Simulation
    setTimeout(() => {
      const response = getAITacticResponse(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const getAITacticResponse = (text: string): Message => {
    const lowText = text.toLowerCase();

    if (lowText.includes("scan") || lowText.includes("profile") || lowText.includes("user")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        text: "Directing neural scan protocols. Use the Explore page to input a GitHub username for deep-space authorship analysis.",
        actions: [{ label: "Go to Explore", route: "/explore" }]
      };
    }

    if (lowText.includes("os") || lowText.includes("tracker") || lowText.includes("open source")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        text: "Contribution trackers initialized. The Open Source Tracker maps your development legacy across the global ecosystem.",
        actions: [{ label: "View OS Tracker", route: "/opensource" }]
      };
    }

    if (lowText.includes("compare") || lowText.includes("vs")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        text: "Tactical comparison matrix ready. Input two handles to determine architectural dominance and style drift.",
        actions: [{ label: "Launch Compare", route: "/compare" }]
      };
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      text: "Neural query processed. I recommend exploring our core diagnostic modules to maximize your tactical output.",
      actions: [
        { label: "Dashboard", route: "/dashboard" },
        { label: "Node Intelligence", route: "/opensource/explorer" }
      ]
    };
  };

  return (
    <>
      {/* Floating Orb Trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl overflow-hidden group border-2 border-white/10",
          isOpen ? "hidden" : "flex"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-fuchsia-600 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
        <img src="/logo/devtrack-logo.png" alt="Logo" className="relative z-10 w-8 h-8 transition-transform duration-500 group-hover:scale-110" />

        {/* HUD Ring Effect */}
        <div className="absolute inset-2 border border-white/20 rounded-full animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-3 border border-white/10 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            onMouseMove={handleMouseMove}
            className="fixed bottom-8 right-8 z-[10001] w-[400px] h-[600px] bg-black/90 border border-white/20 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_0_100px_-20px_rgba(139,92,246,0.5)] flex flex-col overflow-hidden group/card"
          >
            {/* INTERACTIVE SPOTLIGHT */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
              }}
            />
            {/* Header */}
            <header className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-black/50 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/10 group-hover:border-violet-500/50 transition-all">
                    <img src="/logo/devtrack-logo.png" alt="Atlas Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">A.T.L.A.S.</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-violet-400 font-bold uppercase tracking-widest leading-none">Neural_Assistant_v4</span>
                    <Activity size={8} className="text-violet-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group/close"
              >
                <X size={18} className="text-neutral-500 group-hover/close:text-white transition-colors" />
              </button>
            </header>

            {/* Messages Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative"
            >
              {isListening && (
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-full h-full scale-150">
                    <BotAgent />
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.type === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-3xl text-sm leading-relaxed",
                    msg.type === "user"
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white/5 border border-white/5 text-neutral-300 rounded-tl-none font-medium italic"
                  )}>
                    {msg.text}
                  </div>

                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            router.push(action.route);
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-violet-400 uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2 p-4 bg-white/2 rounded-3xl w-20">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Footer */}
            <footer className="p-6 border-t border-white/5 bg-black/40">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="relative flex gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 border flex items-center justify-center",
                    isListening
                      ? "bg-red-500/20 text-red-500 border-red-500 animate-pulse"
                      : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                  )}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Intercept neural query..."}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-neutral-700"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-violet-500 hover:text-white transition-all disabled:opacity-50"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                    <Command size={10} className="text-violet-400" />
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Secure Uplink</span>
                  </div>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                    <Activity size={10} className="text-emerald-400" />
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Live Sync</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 py-1.5 px-3 bg-white/[0.03] border border-white/5 rounded-full shadow-inner">
                  <Sparkles size={8} className="text-fuchsia-400 animate-pulse" />
                  <span className="text-[7px] font-black text-neutral-300 uppercase tracking-[0.2em]">Powered by <span className="text-violet-400">Gemini 1.5 Pro</span></span>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
