"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/lib/badges/schema";
import { Award, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  badge: Badge;
  onDismiss: () => void;
}

export function BadgeUnlockToast({ badge, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="pointer-events-auto w-full max-w-md bg-[#050505] border border-violet-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(139,92,246,0.2)] relative overflow-hidden group"
    >
      {/* Glints and Effects */}
      <div className="absolute inset-0 bg-linear-to-tr from-violet-600/10 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
        <Award size={100} className="text-violet-500" />
      </div>

      <div className="flex gap-6 items-center relative z-10">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-violet-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl border-2 border-violet-500/50 flex flex-col items-center justify-center bg-black relative z-10">
            <Zap className="text-violet-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-bounce" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/40 text-[8px] font-black uppercase tracking-[0.2em] text-violet-400">
              {badge.tier}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              Badge Unlocked
            </span>
          </div>

          <div>
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">
              {badge.name}
            </h4>
            <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest line-clamp-1">
              +{badge.xpValue} EXP Earned
            </p>
          </div>
        </div>
      </div>

      {/* Visual scanning line */}
      <motion.div
        initial={{ left: '-100%' }}
        animate={{ left: '200%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 bottom-0 w-8 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
      />
    </motion.div>
  );
}

// Notification Controller to handle a queue of newly unlocked badges
export function BadgeNotificationProvider({ newlyUnlocked }: { newlyUnlocked: Badge[] }) {
  const [queue, setQueue] = useState<Badge[]>([]);

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      setQueue((prev) => [...prev, ...newlyUnlocked]);
    }
  }, [newlyUnlocked]);

  const dismissFirst = () => {
    setQueue((prev) => prev.slice(1));
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {queue.length > 0 && (
          <BadgeUnlockToast
            key={queue[0].id}
            badge={queue[0]}
            onDismiss={dismissFirst}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
