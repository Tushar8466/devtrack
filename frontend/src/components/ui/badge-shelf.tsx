"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { BadgeCategory, BadgeWithStatus, BADGE_CATEGORY_IMAGES } from "@/lib/badges/schema";
import { Star, Lock, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

const TIER_GLOW: Record<string, string> = {
  BRONZE:   "shadow-[0_0_30px_rgba(180,100,30,0.6)]",
  SILVER:   "shadow-[0_0_30px_rgba(200,200,220,0.6)]",
  GOLD:     "shadow-[0_0_30px_rgba(255,200,0,0.7)]",
  PLATINUM: "shadow-[0_0_40px_rgba(100,220,255,0.8)]",
};

const TIER_RING: Record<string, string> = {
  BRONZE:   "ring-2 ring-amber-700/60",
  SILVER:   "ring-2 ring-neutral-300/50",
  GOLD:     "ring-2 ring-yellow-400/70",
  PLATINUM: "ring-2 ring-cyan-400/80",
};

const TIER_BADGE_COLOR: Record<string, string> = {
  BRONZE:   "bg-amber-900/80 text-amber-400 border-amber-700/50",
  SILVER:   "bg-neutral-800/80 text-neutral-300 border-neutral-500/50",
  GOLD:     "bg-yellow-900/80 text-yellow-400 border-yellow-600/50",
  PLATINUM: "bg-cyan-950/80 text-cyan-400 border-cyan-500/50",
};

interface BadgeShelfProps {
  username: string;
}

export function BadgeShelf({ username }: BadgeShelfProps) {
  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [levelInfo, setLevelInfo] = useState({ level: 1, progress: 0, nextLevelXp: 100, totalXp: 0 });
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "ALL">("ALL");
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch(`/api/badges/${username}`);
        if (res.ok) {
          const data = await res.json();
          setBadges(data.badges);
          setLevelInfo(data.levelStats);
        }
      } catch (e) {
        console.error("Failed to load badges:", e);
      }
    }
    fetchBadges();
  }, [username]);

  const categories: (BadgeCategory | "ALL")[] = ["ALL", "STREAK", "COMMIT", "OPEN_SOURCE", "LANGUAGE", "SOCIAL", "SPECIAL"];

  const filteredBadges = badges.filter(
    (b) => selectedCategory === "ALL" || b.category === selectedCategory
  );

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="w-full space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
          Neural Achievements
          <span className="text-sm font-mono text-neutral-500 not-italic tracking-normal">
            {unlockedCount}/{badges.length}
          </span>
        </h2>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 md:p-10 w-full space-y-8 relative overflow-hidden group">
        {/* Background Ambient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-violet-600/8 transition-colors duration-1000" />

        {/* XP Level Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-black border border-violet-500/30 flex flex-col items-center justify-center">
                <span className="text-2xl font-black italic text-white leading-none">{levelInfo.level}</span>
                <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest">LVL</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Developer Level</span>
              </div>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-violet-600 to-fuchsia-500 rounded-full"
                />
              </div>
              <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                {levelInfo.totalXp} / {levelInfo.totalXp + Math.round(levelInfo.nextLevelXp * (1 - levelInfo.progress / 100))} XP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const).map(tier => {
              const count = badges.filter(b => b.isUnlocked && b.tier === tier).length;
              return (
                <div key={tier} className={cn("px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest", TIER_BADGE_COLOR[tier])}>
                  {tier} · {count}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-1 scrollbar-hide gap-1 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "text-neutral-600 hover:text-neutral-400 border border-transparent"
              )}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Badge Grid — Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 relative z-10">
          {filteredBadges.map((badge) => {
            const imgSrc = BADGE_CATEGORY_IMAGES[badge.category];

            return (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: badge.isUnlocked ? 1.08 : 1.02 }}
                onClick={() => setSelectedBadge(badge)}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 group/badge text-center cursor-pointer",
                  badge.isUnlocked
                    ? cn("bg-black/40 border-white/10 hover:border-white/20", TIER_GLOW[badge.tier])
                    : "bg-white/2 border-white/5"
                )}
              >
                {/* Badge Image */}
                <div className={cn(
                  "relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-500",
                  badge.isUnlocked
                    ? cn("group-hover/badge:scale-110", TIER_RING[badge.tier])
                    : "grayscale opacity-30 ring-2 ring-white/5"
                )}>
                  <Image
                    src={imgSrc}
                    alt={badge.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {/* Shiny overlay for unlocked */}
                  {badge.isUnlocked && (
                    <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                {/* Lock icon overlay for locked */}
                {!badge.isUnlocked && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                  </div>
                )}

                {/* Tier pill */}
                {badge.isUnlocked && (
                  <span className={cn("px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border", TIER_BADGE_COLOR[badge.tier])}>
                    {badge.tier}
                  </span>
                )}

                {/* Name */}
                <p className={cn(
                  "text-[10px] font-black uppercase leading-tight tracking-wide w-full truncate",
                  badge.isUnlocked ? "text-white" : "text-neutral-600"
                )}>
                  {!badge.isUnlocked && badge.isSecret ? "???" : badge.name}
                </p>

                {/* XP pill on unlock */}
                {badge.isUnlocked && (
                  <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest">
                    +{badge.xpValue} XP
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 rounded-4xl overflow-hidden shadow-2xl"
            >
              {/* Ambient glow */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-40 opacity-20 blur-2xl pointer-events-none",
                selectedBadge.tier === "PLATINUM" ? "bg-cyan-400" :
                selectedBadge.tier === "GOLD" ? "bg-yellow-400" :
                selectedBadge.tier === "SILVER" ? "bg-neutral-400" : "bg-amber-700"
              )} />

              <div className="relative p-8 flex flex-col items-center gap-6">
                {/* Big badge image */}
                <div className={cn(
                  "relative w-40 h-40 rounded-3xl overflow-hidden",
                  selectedBadge.isUnlocked ? TIER_RING[selectedBadge.tier] : "grayscale opacity-40 ring-2 ring-white/5",
                  selectedBadge.isUnlocked ? TIER_GLOW[selectedBadge.tier] : ""
                )}>
                  <Image
                    src={BADGE_CATEGORY_IMAGES[selectedBadge.category]}
                    alt={selectedBadge.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* Tier pill */}
                <div className={cn("px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest", TIER_BADGE_COLOR[selectedBadge.tier])}>
                  {selectedBadge.tier} · {selectedBadge.category.replace("_", " ")}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    {!selectedBadge.isUnlocked && selectedBadge.isSecret ? "CLASSIFIED" : selectedBadge.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                    {!selectedBadge.isUnlocked && selectedBadge.isSecret
                      ? "This badge is hidden. Keep exploring to discover it."
                      : selectedBadge.description}
                  </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-white/3 rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-1">Criteria</p>
                    <p className="text-[10px] font-black text-neutral-300 uppercase">
                      {!selectedBadge.isUnlocked && selectedBadge.isSecret ? "???" : selectedBadge.criteriaDescription}
                    </p>
                  </div>
                  <div className="bg-white/3 rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-1">Reward</p>
                    <p className="text-[10px] font-black text-violet-400 uppercase">+{selectedBadge.xpValue} XP</p>
                  </div>
                </div>

                {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
                  <p className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">
                    Unlocked · {new Date(selectedBadge.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}

                {!selectedBadge.isUnlocked && (
                  <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                    <Lock className="w-3 h-3" />
                    Not yet unlocked
                  </div>
                )}

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3 rounded-2xl border border-white/10 text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
