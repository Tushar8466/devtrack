"use client";

import { motion } from "motion/react";
import { Star, GitFork, ExternalLink, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  forks_count?: number;
}

interface TopReposProps {
  repos: Repo[];
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4f5d95",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00b4ab",
  Vue: "#41b883",
};

const MEDAL_COLORS = ["#facc15", "#e2e8f0", "#fb923c"];
const MEDAL_LABELS = ["1st", "2nd", "3rd"];

function LanguageDot({ lang }: { lang: string | null }) {
  if (!lang) return null;
  const color = LANG_COLORS[lang] || "#6b7280";
  return (
    <span className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {lang}
    </span>
  );
}

export function TopReposLeaderboard({ repos }: TopReposProps) {
  const sorted = [...repos]
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 6);

  const maxStars = sorted[0]?.stargazers_count || 1;

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
          Star Leaderboard
        </h2>
        <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20 text-[9px] font-black uppercase tracking-widest text-yellow-400">
          Top {sorted.length} Repos
        </span>
      </div>

      <div className="rounded-4xl border border-white/8 bg-black/40 backdrop-blur-xl overflow-hidden">
        {sorted.map((repo, i) => {
          const barPct = (repo.stargazers_count / maxStars) * 100;
          const medal = MEDAL_COLORS[i];
          const isTop3 = i < 3;

          return (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "flex items-center gap-5 px-6 py-4 border-b border-white/5 last:border-0 group relative overflow-hidden transition-all hover:bg-white/3",
              )}
            >
              {/* Background bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.07 + 0.3 }}
                className="absolute inset-y-0 left-0 pointer-events-none"
                style={{
                  background: isTop3
                    ? `linear-gradient(90deg, ${medal}08, transparent)`
                    : "linear-gradient(90deg, rgba(255,255,255,0.02), transparent)",
                }}
              />

              {/* Rank */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs relative z-10"
                style={
                  isTop3
                    ? { background: `${medal}15`, color: medal, border: `1px solid ${medal}30` }
                    : { background: "rgba(255,255,255,0.03)", color: "#4b5563", border: "1px solid rgba(255,255,255,0.05)" }
                }
              >
                {isTop3 ? <Trophy className="w-3.5 h-3.5" /> : i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-yellow-400 transition-colors truncate">
                    {repo.name}
                  </h3>
                  {isTop3 && (
                    <span
                      className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ color: medal, background: `${medal}15` }}
                    >
                      {MEDAL_LABELS[i]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <LanguageDot lang={repo.language} />
                  {repo.forks_count !== undefined && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-neutral-600">
                      <GitFork className="w-2.5 h-2.5" />
                      {repo.forks_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1.5 shrink-0 relative z-10" style={{ color: isTop3 ? medal : "#6b7280" }}>
                <Star className={cn("w-3.5 h-3.5", isTop3 && "fill-current")} />
                <span className="text-sm font-black tabular-nums">
                  {repo.stargazers_count.toLocaleString()}
                </span>
              </div>

              <ExternalLink className="w-3 h-3 text-neutral-700 group-hover:text-neutral-400 transition-colors shrink-0 relative z-10" />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
