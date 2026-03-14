"use client";

import { motion } from "motion/react";
import { Code2, Terminal, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Repo {
  language: string | null;
}

interface LanguageProficiencyProps {
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

export function LanguageProficiency({ repos }: LanguageProficiencyProps) {
  const languages: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  const totalReposWithLang = sortedLangs.reduce((acc, curr) => acc + curr.count, 0);

  if (sortedLangs.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-cyan-400 rounded-full" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Linguistic Proficiency</h2>
        <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-[9px] font-black uppercase tracking-widest text-cyan-400">
          {sortedLangs.length} Languages Detected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedLangs.map((lang, i) => {
          const pct = Math.round((lang.count / totalReposWithLang) * 100);
          const color = LANG_COLORS[lang.name] || "#6b7280";

          return (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative p-5 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl group hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all"
                    style={{
                      background: `${color}15`,
                      borderColor: `${color}30`,
                      color: color,
                    }}
                  >
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">
                      {lang.name}
                    </h3>
                    <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">
                      {lang.count} {lang.count === 1 ? "Repository" : "Repositories"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white italic tracking-tighter">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 + 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background: color,
                    boxShadow: `0 0 10px ${color}50`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
