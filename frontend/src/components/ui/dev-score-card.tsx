"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { Cpu, TrendingUp, Star, GitBranch, Zap, Shield } from "lucide-react";

interface DevScoreCardProps {
  repos: number;
  followers: number;
  stars: number;
  streak: number;
  languages: number;
  commits: number;
}

function Gauge({ value, color }: { value: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      {/* Track */}
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
      {/* Fill */}
      <motion.circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span>{display}</span>;
}

function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all group">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export function DevScoreCard({
  repos,
  followers,
  stars,
  streak,
  languages,
  commits,
}: DevScoreCardProps) {
  // Score formula: weighted combination of all metrics
  const repoScore    = Math.min(repos / 50, 1) * 20;
  const followerScore = Math.min(followers / 200, 1) * 15;
  const starsScore   = Math.min(stars / 500, 1) * 20;
  const streakScore  = Math.min(streak / 100, 1) * 25;
  const langScore    = Math.min(languages / 10, 1) * 10;
  const commitScore  = Math.min(commits / 365, 1) * 10;

  const total = Math.round(repoScore + followerScore + starsScore + streakScore + langScore + commitScore);

  const tier =
    total >= 85 ? { label: "LEGENDARY", color: "#a78bfa", glow: "rgba(167,139,250,0.4)" } :
    total >= 70 ? { label: "ELITE",     color: "#facc15", glow: "rgba(250,204,21,0.4)"  } :
    total >= 50 ? { label: "ADVANCED",  color: "#34d399", glow: "rgba(52,211,153,0.4)"  } :
    total >= 30 ? { label: "GROWING",   color: "#60a5fa", glow: "rgba(96,165,250,0.4)"  } :
                  { label: "BEGINNER",  color: "#9ca3af", glow: "rgba(156,163,175,0.3)" };

  const bars = [
    { label: "Repos",     pct: Math.round((repoScore / 20) * 100),     color: "#818cf8" },
    { label: "Followers", pct: Math.round((followerScore / 15) * 100), color: "#34d399" },
    { label: "Stars",     pct: Math.round((starsScore / 20) * 100),    color: "#facc15" },
    { label: "Streak",    pct: Math.round((streakScore / 25) * 100),   color: "#f472b6" },
    { label: "Languages", pct: Math.round((langScore / 10) * 100),     color: "#22d3ee" },
    { label: "Activity",  pct: Math.round((commitScore / 10) * 100),   color: "#fb923c" },
  ];

  return (
    <div className="relative rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-2xl p-8 overflow-hidden group hover:border-white/15 transition-all">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 50%, ${tier.glow} 0%, transparent 60%)` }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 rounded-full" style={{ background: tier.color }} />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Developer Score</h2>
        <span
          className="ml-auto px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] border"
          style={{ color: tier.color, borderColor: `${tier.color}40`, background: `${tier.color}10` }}
        >
          {tier.label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Gauge */}
        <div className="relative shrink-0">
          <Gauge value={total} color={tier.color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white italic tabular-nums">
              <AnimatedNumber target={total} />
            </span>
            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">/100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-3">
          {bars.map((b) => (
            <div key={b.label} className="space-y-1">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">{b.label}</span>
                <span style={{ color: b.color }}>{b.pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: b.color, boxShadow: `0 0 8px ${b.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative scan line */}
      <motion.div
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
        className="absolute inset-x-0 h-px opacity-10 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
      />
    </div>
  );
}
