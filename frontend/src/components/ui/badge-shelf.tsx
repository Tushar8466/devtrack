"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BadgeWithStatus,
  BadgeTier,
  BadgeCategory,
  BADGE_CATEGORY_IMAGES,
  calculateDeveloperLevel,
} from "@/lib/badges/schema";
import { Award, Lock, ChevronDown, ChevronUp, Zap } from "lucide-react";

/* ─── Tier colour tokens ─────────────────────────────────────── */
const TIER_STYLES: Record<
  BadgeTier,
  {
    border: string;
    glow: string;
    text: string;
    badge: string;
    ring: string;
  }
> = {
  BRONZE:   { border: "border-amber-700/60",   glow: "shadow-[0_0_20px_rgba(180,83,9,0.35)]",    text: "text-amber-600",   badge: "bg-amber-900/20",   ring: "ring-amber-700/40" },
  SILVER:   { border: "border-slate-400/60",   glow: "shadow-[0_0_20px_rgba(148,163,184,0.3)]",  text: "text-slate-300",   badge: "bg-slate-700/20",   ring: "ring-slate-400/30" },
  GOLD:     { border: "border-yellow-400/60",  glow: "shadow-[0_0_25px_rgba(250,204,21,0.3)]",   text: "text-yellow-400",  badge: "bg-yellow-500/10",  ring: "ring-yellow-400/40" },
  PLATINUM: { border: "border-violet-400/70",  glow: "shadow-[0_0_30px_rgba(167,139,250,0.4)]",  text: "text-violet-300",  badge: "bg-violet-500/15",  ring: "ring-violet-400/50" },
};

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  STREAK:      "Streak",
  COMMIT:      "Commit",
  OPEN_SOURCE: "Open Source",
  LANGUAGE:    "Language",
  SOCIAL:      "Social",
  SPECIAL:     "Special",
};

/* ─── Badge Card ─────────────────────────────────────────────── */
function BadgeCard({ badge }: { badge: BadgeWithStatus }) {
  const [hover, setHover] = useState(false);
  const tier = TIER_STYLES[badge.tier];
  const unlocked = badge.isUnlocked;

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex flex-col items-center text-center gap-3 p-5 rounded-3xl border transition-all duration-700 overflow-hidden cursor-default group",
        unlocked
          ? `${tier.border} ${tier.glow} ${tier.badge}`
          : "border-white/5 bg-white/2 opacity-30 grayscale"
      )}
    >
      {/* Holographic shimmer on hover */}
      {unlocked && (
        <motion.div
          animate={hover ? { left: "200%" } : { left: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-12 bg-linear-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] pointer-events-none"
        />
      )}

      {/* Category badge image */}
      <div className={cn(
        "relative w-14 h-14 rounded-2xl flex items-center justify-center border ring-2 overflow-hidden transition-all duration-500",
        unlocked ? `${tier.border} ${tier.ring}` : "border-white/10 ring-white/5",
      )}>
        {unlocked ? (
          <Image
            src={BADGE_CATEGORY_IMAGES[badge.category]}
            alt={badge.category}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <Lock className="w-5 h-5 text-neutral-600" />
        )}
      </div>

      {/* Tier pill */}
      <span className={cn(
        "px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-[0.2em]",
        unlocked ? `${tier.border} ${tier.text}` : "border-white/10 text-neutral-600"
      )}>
        {badge.tier}
      </span>

      {/* Name + description */}
      <div className="space-y-0.5">
        <h4 className={cn(
          "text-[11px] font-black uppercase italic tracking-tight leading-tight",
          unlocked ? "text-white" : "text-neutral-600"
        )}>
          {badge.name}
        </h4>
        <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest line-clamp-2">
          {badge.criteriaDescription}
        </p>
      </div>

      {/* XP chip */}
      {unlocked && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
          tier.text, tier.badge
        )}>
          <Zap className="w-2.5 h-2.5" />
          +{badge.xpValue} XP
        </span>
      )}

      {/* Active dot */}
      {unlocked && (
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
      )}

      {/* Secret badge hint */}
      {badge.isSecret && !unlocked && (
        <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest">Secret</span>
      )}
    </motion.div>
  );
}

/* ─── Main BadgeShelf ─────────────────────────────────────────── */
interface BadgeShelfProps {
  username: string;
}

export function BadgeShelf({ username }: BadgeShelfProps) {
  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    fetch(`/api/badges/${encodeURIComponent(username)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load badges");
        const data = await res.json();
        setBadges(data.badges ?? []);
        setTotalXp(data.totalXp ?? 0);
      })
      .catch(() => setError("Could not load badges."))
      .finally(() => setLoading(false));
  }, [username]);

  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const lockedBadges = badges.filter((b) => !b.isUnlocked);
  const levelInfo = calculateDeveloperLevel(totalXp);

  const displayedBadges = showAll ? badges : [...unlockedBadges, ...lockedBadges].slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
            Achievement Shelf
          </h2>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-400">
            {unlockedBadges.length}/{badges.length} Unlocked
          </span>
        </div>

        {/* XP + Level */}
        <div className="flex items-center gap-4 px-5 py-2 rounded-2xl border border-white/5 bg-black/30 backdrop-blur-xl">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Developer Level</span>
            <span className="text-lg font-black text-white italic">Lvl {levelInfo.level}</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Total XP</span>
            <span className="text-sm font-black text-amber-400">{totalXp.toLocaleString()} XP</span>
          </div>
          {/* XP progress bar */}
          <div className="flex flex-col gap-1 min-w-[80px]">
            <div className="flex justify-between">
              <span className="text-[7px] font-mono text-neutral-700">Next Lvl</span>
              <span className="text-[7px] font-mono text-neutral-700">{Math.round(levelInfo.progress)}%</span>
            </div>
            <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center h-40 rounded-3xl border border-white/5 bg-black/30">
          <div className="flex flex-col items-center gap-3 opacity-40">
            <Award className="w-8 h-8 text-amber-400 animate-pulse" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Loading badges…</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32 rounded-3xl border border-red-500/20 bg-red-500/5">
          <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : badges.length === 0 ? (
        <div className="flex items-center justify-center h-40 rounded-3xl border border-white/5 bg-black/30">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Award className="w-8 h-8 text-neutral-500" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">No badges found</p>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3"
            >
              {displayedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <BadgeCard badge={badge} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {badges.length > 8 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                {showAll ? (
                  <><ChevronUp className="w-3 h-3" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-3 h-3" /> Show All {badges.length} Badges</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
